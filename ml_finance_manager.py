import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.metrics import silhouette_score
from sklearn.model_selection import GridSearchCV, StratifiedKFold
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from sklearn.model_selection import KFold
import warnings
import json
import os
import sys
import json
from pathlib import Path
import glob
import uuid
from datetime import timedelta

def clear_static_folder(folder_path):
    """
    Remove all files in the specified folder to ensure only the latest files exist.
    """
    files = glob.glob(os.path.join(folder_path, '*'))
    for file in files:
        os.remove(file)
        
warnings.filterwarnings("ignore")             
base_dir = os.getcwd()
static_folder = os.path.join(base_dir, "static")
os.makedirs(static_folder, exist_ok=True) 
                                     
def choose_best_clustering_model(data):
    models = {
        'KMeans': KMeans(),
        'DBSCAN': DBSCAN(),
        'AgglomerativeClustering': AgglomerativeClustering()
    }

    param_grids = {
        'KMeans': {'n_clusters': [2, 3, 4, 5, 6, 7, 8, 9, 10]},
        'DBSCAN': {'eps': [0.3, 0.5, 0.7, 1.0], 'min_samples': [3, 5, 10]},
        'AgglomerativeClustering': {'n_clusters': [2, 3, 4, 5, 6, 7, 8, 9, 10]}
    }

    outer_cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    best_model = None
    best_score = -1

    for model_name, model in models.items():
        param_grid = param_grids[model_name]

        grid_search = GridSearchCV(estimator=model, param_grid=param_grid, cv=outer_cv, scoring='accuracy')

        outer_results = []
        for train_idx, test_idx in outer_cv.split(data, np.zeros(data.shape[0])):
            X_train, X_test = data[train_idx], data[test_idx]

            inner_cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)
            grid_search = GridSearchCV(estimator=model, param_grid=param_grids[model_name], cv=inner_cv, scoring='accuracy')
            grid_search.fit(X_train, np.zeros(X_train.shape[0]))

            best_model = grid_search.best_estimator_
            labels = best_model.fit_predict(X_test)

            if len(set(labels)) > 1:
                test_score = silhouette_score(X_test, labels)
                outer_results.append(test_score)

        if outer_results:
            average_performance = np.mean(outer_results)
            # print(f"{model_name} Average Performance: {average_performance}")

            if average_performance > best_score:
                best_score = average_performance
                best_model = grid_search.best_estimator_

    return best_model

def save_plot_to_file(plot_func, file_name):
    plt.figure()
    plot_func()
    plt.savefig(file_name)
    plt.close()

def forecast_expenses(data):
    forecast_results = []

    # Handle bad/missing date values
    data['Date'] = pd.to_datetime(data.iloc[:, 0], errors='coerce')
    data = data.dropna(subset=['Date'])

    for cat in data['Category'].unique():
        cat_data = data[data['Category'] == cat]

        # Monthly aggregation
        monthly_totals = cat_data.groupby(pd.Grouper(key='Date', freq='M'))['DebitedAmount'].sum().dropna()

        if len(monthly_totals) < 3:
            continue  # not enough data to forecast

        # Exponential Smoothing
        model = ExponentialSmoothing(monthly_totals, trend='add', seasonal=None, damped_trend=True)
        fit = model.fit()
        forecast = fit.forecast(3)

        for date, amount in forecast.items():
            forecast_results.append({
                'Category': cat,
                'Month': date.strftime('%B %Y'),
                'PredictedExpense': round(amount, 2)
            })

    return forecast_results

def process_transactions(file_path, target_savings):
    clear_static_folder(static_folder)
    data = pd.read_excel(file_path)

    descriptions = data.iloc[:, 2]
    debits = data.iloc[:, 4]

    def extract_transaction_name(description):
        parts = description.split('/')
        return parts[-2] if len(parts) > 1 else ''

    data['TransactionName'] = descriptions.apply(lambda x: extract_transaction_name(x) if isinstance(x, str) else '')

    debits = pd.to_numeric(debits, errors='coerce')
    data = data[debits.notna()]
    data['DebitedAmount'] = debits.dropna()

    scaler = StandardScaler()
    debits_normalized = scaler.fit_transform(data['DebitedAmount'].values.reshape(-1, 1))

    unique_values = np.unique(debits_normalized)
    if len(unique_values) < 2:
        print("Not enough variability in data for clustering.")
        categories = np.zeros(debits_normalized.shape[0], dtype=int)
    else:
        best_model = choose_best_clustering_model(debits_normalized)
        categories = best_model.fit_predict(debits_normalized)

    category_mapping = {i: category for i, category in enumerate(['Low', 'Medium', 'High'])}
    data['Category'] = [category_mapping[label] for label in categories]

    pie_chart_filename = f"pie_chart_{uuid.uuid4().hex}.png"
    scatter_plot_filename = f"scatter_plot_{uuid.uuid4().hex}.png"
    pie_chart_path = os.path.join(static_folder, pie_chart_filename)
    scatter_plot_path = os.path.join(static_folder, scatter_plot_filename)
    
    # Save pie chart
    def plot_pie_chart():
        category_counts = data['Category'].value_counts()
        category_counts.plot.pie(autopct='%1.1f%%')
        plt.title('Spending Categories')

    save_plot_to_file(plot_pie_chart, pie_chart_path)

    # Save scatter plot
    def plot_frequency_vs_price():
        transaction_frequency = data['TransactionName'].value_counts()

        frequency_price_df = pd.DataFrame({
            'Frequency': data['TransactionName'].map(transaction_frequency),
            'Price': data['DebitedAmount'],
            'Category': data['Category']
        })

        categories_unique = frequency_price_df['Category'].unique()
        colors = plt.cm.get_cmap('tab10', len(categories_unique))
        
        plt.figure(figsize=(10, 6))
        
        for i, category in enumerate(categories_unique):
            subset = frequency_price_df[frequency_price_df['Category'] == category]
            plt.scatter(subset['Frequency'], subset['Price'], color=colors(i), label=category, alpha=0.6, edgecolors='w', s=100)

        plt.xlabel('Frequency')
        plt.ylabel('Price')
        plt.title('Frequency vs. Price')
        plt.legend()
        plt.grid(True)
        

    save_plot_to_file(plot_frequency_vs_price, scatter_plot_path)

    # Recommend savings
    def recommend_savings(expenses, target_savings):
        current_spending = expenses['DebitedAmount'].sum()
        reduction_percentage = target_savings / current_spending
        expenses['RecommendedSavings'] = expenses['DebitedAmount'] * reduction_percentage
        return expenses

    unnecessary_expenses = data[data['Category'] == 'Low']
    savings_recommendations = recommend_savings(unnecessary_expenses, target_savings)
    
    # Convert recommendations to JSON
    recommendations_json = savings_recommendations[['TransactionName', 'Category', 'DebitedAmount', 'RecommendedSavings']].to_dict(orient='records')

    forecast_json = forecast_expenses(data)
    # Ensure paths are returned in a JSON-safe format
    results = {
        'pieChart': f"/static/{pie_chart_filename}",
        'scatterPlot': f"/static/{scatter_plot_filename}",
        'savingsRecommendations': recommendations_json,
        'expenseForecast': forecast_json
    }

    return json.dumps(results)



if __name__ == "__main__":
    import sys
    try:
        file_path = sys.argv[1]
        target_savings = float(sys.argv[2])
        results = process_transactions(file_path, target_savings)
        sys.stdout.write(results)  # Use sys.stdout.write to avoid additional newline characters
    except Exception as e:
        # Print error in JSON format
        error_message = json.dumps({"error": str(e)})
        sys.stdout.write(error_message)
        sys.exit(1)
