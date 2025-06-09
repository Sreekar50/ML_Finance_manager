# Finance Manager

A comprehensive financial analytics application that analyzes transaction data to provide intelligent spending insights, categorization, and future expense predictions using machine learning algorithms.

## 🎯 Features

### Core Functionality
- **Smart Transaction Categorization**: Automatically categorizes transactions into High, Medium, and Low spending categories using advanced clustering algorithms
- **Intelligent Savings Recommendations**: Provides personalized savings suggestions based on user-defined target amounts
- **Expense Forecasting**: Predicts spending patterns for the next 3 months using exponential smoothing
- **Interactive Visualizations**: Generates pie charts and scatter plots for spending analysis
- **User Authentication**: Secure login and registration system

### Machine Learning Features
- **Best-Fit Clustering Model Selection**: Automatically selects the optimal clustering algorithm (KMeans, DBSCAN, or Agglomerative Clustering) using k-fold cross-validation
- **Hyperparameter Tuning**: Optimizes clustering parameters through grid search
- **Price vs Frequency Analysis**: Analyzes transaction patterns based on spending amount and frequency
- **Time Series Forecasting**: Uses Holt-Winters exponential smoothing for expense prediction

## 🏗️ Architecture

### Backend (Node.js + Express)
- RESTful API endpoints for user authentication and transaction processing
- File upload handling for Excel transaction data
- Python script integration for ML processing
- Static file serving for generated visualizations

### Frontend (React)
- Modern, responsive user interface
- File upload with drag-and-drop support
- Real-time results visualization
- Interactive charts and tables

### Machine Learning Pipeline (Python)
- Pandas for data manipulation and analysis
- Scikit-learn for clustering algorithms and model selection
- Matplotlib for visualization generation
- Statsmodels for time series forecasting

## 📋 Prerequisites

### Backend Dependencies
- Node.js (v14 or higher)
- npm or yarn package manager
- MongoDB database
- Python 3.7+

### Python Dependencies
```
pandas
numpy
matplotlib
scikit-learn
statsmodels
openpyxl
```

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd finance-manager
```

### 2. Backend Setup
```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
pip install pandas numpy matplotlib scikit-learn statsmodels openpyxl
```

### 3. Frontend Setup
```bash
cd client
npm install
```

### 4. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/finance_manager
NODE_ENV=development
```

### 5. Database Setup
Ensure MongoDB is running on your system. The application will automatically create the necessary collections.

## 🎮 Usage

### 1. Start the Backend Server
```bash
npm start
# Server runs on http://localhost:8080
```

### 2. Start the Frontend Development Server
```bash
cd client
npm start
# Frontend runs on http://localhost:3000
```

### 3. Using the Application

#### Registration/Login
1. Navigate to the registration page to create a new account
2. Login with your credentials

#### Transaction Analysis
1. **Upload Excel File**: Upload your bank statement in Excel format (.xls or .xlsx)
2. **Set Target Savings**: Enter your desired savings amount
3. **Analyze**: Click submit to process your transactions

#### Understanding Results
- **Pie Chart**: Shows distribution of spending across High/Medium/Low categories
- **Scatter Plot**: Visualizes frequency vs. price relationships
- **Savings Recommendations**: Specific suggestions for reducing expenses
- **Expense Forecast**: Predicted spending for the next 3 months

## 📊 Machine Learning Methodology

### Clustering Algorithm Selection
The system uses a sophisticated model selection process:

1. **Cross-Validation**: 5-fold stratified cross-validation for robust evaluation
2. **Multiple Algorithms**: Tests KMeans, DBSCAN, and Agglomerative Clustering
3. **Hyperparameter Tuning**: Grid search optimization for each algorithm
4. **Performance Metric**: Silhouette score for cluster quality assessment
5. **Best Model Selection**: Chooses the algorithm with highest average performance

### Feature Engineering
- **Transaction Name Extraction**: Parses merchant information from transaction descriptions
- **Amount Normalization**: Standardizes transaction amounts for clustering
- **Temporal Aggregation**: Groups transactions by month for forecasting

### Forecasting Model
- **Exponential Smoothing**: Holt-Winters method with additive trend
- **Monthly Predictions**: Forecasts next 3 months of expenses by category
- **Trend Analysis**: Captures seasonal and trend patterns in spending

## 🗂️ Project Structure

```
finance-manager/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/             # Page components
│   │   └── styles/            # CSS stylesheets
├── config/                    # Database configuration
├── controllers/               # Route controllers
├── models/                    # Database models
├── routes/                    # API routes
├── static/                    # Generated visualizations
├── uploads/                   # Temporary file storage
├── transactions.py            # ML processing script
└── server.js                 # Main server file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login

### Transaction Processing
- `POST /api/v1/upload` - Upload and process Excel file

### Static Files
- `GET /static/*` - Serve generated charts and visualizations

## 📈 Expected Excel Format

Your Excel file should contain the following columns:
- **Column A**: Date (various formats supported)
- **Column C**: Transaction Description
- **Column E**: Debit Amount (numeric values)

The system automatically parses merchant names and transaction amounts from this format.

## 🛠️ Technical Implementation

### Clustering Process
1. **Data Preprocessing**: Clean and normalize transaction amounts
2. **Feature Scaling**: StandardScaler for consistent clustering
3. **Model Evaluation**: Cross-validation with multiple algorithms
4. **Optimal Selection**: Best performing model based on silhouette score
5. **Category Assignment**: High/Medium/Low based on cluster characteristics

### Visualization Generation
- **Dynamic File Naming**: UUID-based filenames prevent caching issues
- **Automatic Cleanup**: Clears old visualizations before generating new ones
- **Real-time Updates**: Fresh visualizations for each analysis



## 🔧 Troubleshooting

### Common Issues

#### Python Script Execution Errors
- Ensure Python 3.7+ is installed and accessible via `python` command
- Verify all required Python packages are installed
- Check file permissions for the `transactions.py` script

#### File Upload Issues
- Ensure uploads directory has write permissions
- Verify Excel file format is .xls or .xlsx
- Check file size limitations (default: 50MB)

#### Database Connection
- Verify MongoDB is running
- Check connection string in `.env` file
- Ensure database user has appropriate permissions

#### Visualization Display
- Clear browser cache if images don't update
- Check static directory permissions
- Verify image paths in API responses

## 🎯 Future Enhancements

- Real-time transaction monitoring
- Advanced budgeting features
- Mobile application development
- Integration with banking APIs
- Enhanced forecasting models
- Multi-currency support
- Expense categories customization



---

**Note**: This application is designed for educational and personal finance management purposes. Always verify financial recommendations with qualified financial advisors.
