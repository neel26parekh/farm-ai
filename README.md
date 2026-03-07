# Agro Nexus

Agro Nexus is a hybrid agriculture project that combines a local web interface with machine learning notebooks for agricultural decision support. The repository contains a landing website, supporting marketing pages, notebook-based model development for crop and fertilizer recommendations, and references to remote Google Colab training artifacts.

## Overview

The project is organized around two parts:

1. A local website interface that exposes crop recommendation, fertilizer suggestion, production estimation, and yield estimation directly inside the site.
2. A set of Jupyter notebooks used to explore datasets, train models, evaluate performance, and export serialized artifacts with `pickle`.
3. A dependency-free Python server that serves the website, exposes local prediction endpoints, and reports model diagnostics when notebook data or artifacts are missing.

The repository also includes plain-text references to live and remote assets:

- `farmAI`: Vercel deployment URL for the project website.
- `model-01` to `model-04`: Google Colab notebook links used during model experimentation and development.

## Repository Structure

```text
Agro-Nexus/
├── index.html
├── index copy.html
├── product.html
├── service.html
├── team.html
├── testimonial.html
├── livecount.html
├── Crop_Recommendation_2.ipynb
├── ferti.ipynb
├── regression.ipynb
├── yield.ipynb
├── farmAI
├── model-01
├── model-02
├── model-03
├── model-04
└── README.md
```

## Website Files

### `index.html`

Primary landing page for Agro Nexus. It is now a self-contained local interface with modern styling, in-page forms for all prediction workflows, JavaScript calls to local API endpoints, and a diagnostics view that reports missing datasets and model artifacts.

### `index copy.html`

Archived alternate homepage. It now redirects to the main local Agro Nexus interface so there are no stale external prediction links left in the website flow.

### `server.py`

Local HTTP server for the project. It serves the website, exposes JSON endpoints for crop recommendation, fertilizer suggestion, production estimation, and yield estimation, and reports whether the notebook datasets and serialized artifacts are present.

### `product.html`

Static product showcase page following the same visual template as the home page.

### `service.html`

Static services page describing Agro Nexus offerings.

### `team.html`

Static team presentation page.

### `testimonial.html`

Static testimonials page built on the same theme.

### `livecount.html`

Small jQuery-based visitor counter snippet. It increments the displayed count on page load for demonstration purposes.

## Machine Learning Notebooks

### `Crop_Recommendation_2.ipynb`

Crop recommendation notebook for a classification workflow. The notebook reads `crop_recommendation.csv`, performs exploratory analysis, uses `SMOTE` for class balancing, and evaluates several classification approaches including Decision Tree, Naive Bayes, SVM, Logistic Regression, and Random Forest.

### `ferti.ipynb`

Fertilizer prediction notebook. It reads `Fertilizer Prediction-2.csv`, performs visual analysis, encodes categorical values, and trains classifiers including Logistic Regression and Random Forest. It also uses `GridSearchCV` and exports serialized objects with `pickle`.

### `regression.ipynb`

Crop regression notebook for yield-related prediction work. It reads `crop_regression.csv`, explores the data, builds preprocessing and model pipelines, and serializes both the data frame and fitted pipeline artifacts.

### `yield.ipynb`

Yield prediction notebook that reads `yield_df.csv` and builds regression pipelines using tools such as `LinearRegression`, `RandomForestRegressor`, `OneHotEncoder`, `ColumnTransformer`, and `Pipeline`. It also serializes model outputs with `pickle`.

## External References

### Live Website

The file `farmAI` contains the deployed Vercel URL:

`https://farm-ai-htl-2526.vercel.app/`

### Remote Model Notebooks

The files `model-01` through `model-04` each contain a Google Colab link:

- `model-01`: `https://colab.research.google.com/drive/1y8XDfIwbaqxFb_kNbvb1j9RxtFj2h7fe`
- `model-02`: `https://colab.research.google.com/drive/1TQqxwGVgvMwSugHkJ3tvMhP60BKJ1uru`
- `model-03`: `https://colab.research.google.com/drive/1jAHcVJKqpaxCu4Agq5guw_Ml1dj4jtKS`
- `model-04`: `https://colab.research.google.com/drive/1y4kY4f-Aa6NBRQ2Fs8TtdaHQfpofwAFs`

These are references only. The actual Colab notebook contents are not stored in this repository.

## Tech Stack

### Frontend

- HTML5
- Bootstrap
- Font Awesome
- Bootstrap Icons
- Owl Carousel
- jQuery

### Data Science and ML

- Python
- pandas
- numpy
- matplotlib
- seaborn
- scikit-learn
- imbalanced-learn
- pickle

## How To Run

### View the Website Locally

Run the local Agro Nexus server from the repository root:

```bash
/usr/local/bin/python3 server.py
```

Then open `http://localhost:8000` in your browser.

### Deploy on Vercel

This repository is now structured so the existing website can be deployed directly on Vercel:

- `index.html` and the other HTML pages are served as static files.
- `api/index.py` handles `/api/health` and all `/api/predict/*` routes.
- `vercel.json` rewrites `/api/*` requests to the Python function so the frontend does not need to change.

Deploy steps:

```bash
npm install -g vercel
vercel
```

When prompted:

- Set the project root to this repository folder.
- Keep the default static deployment settings.
- Do not add a framework preset.

For production deployment:

```bash
vercel --prod
```

Important: the deployed API will still run in `heuristic-fallback` mode until the missing datasets and serialized model artifacts are added to the repository.

### Run the Notebooks Locally

Install the likely notebook dependencies:

```bash
pip install pandas numpy matplotlib seaborn scikit-learn imbalanced-learn jupyter
```

Start Jupyter:

```bash
jupyter notebook
```

Then open any of the notebooks in the repository root.

## Required Data Files

The notebooks expect dataset files that are not included in this repository:

- `crop_recommendation.csv`
- `Fertilizer Prediction-2.csv`
- `crop_regression.csv`
- `yield_df.csv`

Without these files, the notebook pipelines cannot be executed successfully.

## Known Gaps and Caveats

- The repository does not include a `requirements.txt`, `environment.yml`, or other dependency lock file.
- Several HTML pages reference local assets such as `css/style.css`, `js/main.js`, `lib/owlcarousel`, and images under `img/`, but those asset directories are not present in this repository.
- Multiple pages link to `contact.html`, but that file is not included.
- The notebooks contain saved outputs and appear to have been authored in or exported from Google Colab.
- The notebooks depend on CSV datasets that are not committed, so the sklearn training path is incomplete in this repository.
- The local website is standalone, but it currently falls back to built-in inference logic because the notebook datasets and serialized sklearn artifacts are missing.

## Suggested Improvements

1. Add the missing static assets so the website can run locally without broken styles and images.
2. Add a `requirements.txt` or `environment.yml` for reproducible notebook setup.
3. Include sample datasets or clear instructions for obtaining them.
4. Export and commit reproducible model artifacts if you want the website to switch from fallback inference to notebook-trained sklearn models.
5. Remove duplicate or archival files if they are no longer needed, or document their purpose explicitly.

## Summary

Agro Nexus is best understood as a combined showcase and experimentation repository: the website presents the platform and links users to deployed services, while the notebooks capture the machine learning workflows behind crop recommendation, fertilizer prediction, and yield-related analysis.