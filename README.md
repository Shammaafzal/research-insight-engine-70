# Research Weaver

Build a complete, modern, professional web application called “ResearchAI – Intelligent Research Paper Classification System”.

This is an academic final-year project for automatically analyzing and classifying research papers using SciBERT + Vision Transformer (ViT) + Multimodal Feature Fusion + Explainable AI (SHAP).

IMPORTANT:

Build the application as a real working full-stack website, not just a static UI.

The ML model/backend already exists or will be connected separately through a Python FastAPI API.

Do NOT replace the ML architecture with a different model.

Keep the frontend architecture clean so that the Python ML API can easily be connected.

Use realistic loading, error, success and empty states.

Make the website look like a professional AI research platform suitable for a college project demonstration.

TECH STACK

Frontend:

React

TypeScript

Tailwind CSS

Modern component library such as shadcn/ui

Lucide icons

Responsive design

Backend integration:

Python FastAPI REST API

The frontend should communicate with the ML backend through API endpoints.

Keep API URLs configurable using environment variables.

Charts:

Use Recharts or an equivalent chart library.

MAIN PURPOSE

The user uploads a scientific research paper in PDF format.

The system should:

Accept the PDF.

Extract the paper's text.

Extract figures/images from the paper.

Process textual information using SciBERT.

Process visual information using Vision Transformer (ViT).

Fuse textual and visual embeddings.

Predict the research field.

Display prediction confidence.

Provide SHAP-based explanation of the prediction.

Generate a paper summary.

Extract useful metadata and citations.

Recommend suitable conferences.

Display conference match scores and important submission information.

RESEARCH FIELDS

Initially support these research categories:

Machine Learning

Natural Language Processing

Computer Vision

Information Retrieval

Artificial Intelligence

Language Models / Machine Learning

General AI

The backend should ultimately determine the prediction. Do not hard-code the prediction in the frontend.

WEBSITE STRUCTURE

Create these pages:

1. LANDING PAGE

Create a visually impressive academic AI landing page.

Hero section:

Title:
“From Research Papers to Knowledge”

Subtitle:
“AI-powered research paper classification using multimodal scientific understanding.”

Buttons:

“Analyze a Paper”

“Explore Features”

Show a visual workflow:

PDF → Text + Figures → SciBERT + ViT → Feature Fusion → Classification → Explanation

Add feature cards:

AI Research Classification

Multimodal Analysis

Explainable AI

Paper Summarization

Citation Extraction

Conference Recommendations

Add a section explaining why research classification is important.

Do not overcrowd the page.

2. ANALYZE PAPER PAGE

Create the main PDF upload interface.

Large drag-and-drop area:

“Upload your research paper”

Supported format:
PDF

Show:

PDF icon

Drag and drop message

Browse Files button

Maximum file size

Selected filename

After uploading:

Show a processing interface with stages:

Reading PDF

Extracting text

Extracting figures

Generating SciBERT embeddings

Generating ViT embeddings

Fusing multimodal features

Classifying research field

Generating explanation

Use an animated progress indicator.

After processing, display the results.

3. RESULTS PAGE

Create a professional research-analysis dashboard.

Top section:

“Research Field Prediction”

Display:

Predicted Field:
“Computer Vision”

Confidence:
“87.4%”

Use a large circular confidence visualization.

Also display:

Top Predictions:

Computer Vision — 87.4%
Machine Learning — 7.8%
Artificial Intelligence — 3.1%
Other — 1.7%

The actual values must come from the backend.

Add a “View Explanation” button.

4. PAPER INFORMATION

Display extracted information:

Paper title

Authors

Abstract

Keywords

Publication information

Number of pages

Number of figures

Number of references

If some information is unavailable, show “Not available” rather than inventing information.

5. PAPER SUMMARY

Create a clean summary section containing:

Short Summary

Key Contributions

Methodology

Main Findings

Research Area

The backend can provide the generated summary.

Show a “Copy Summary” button.

6. EXPLAINABLE AI / SHAP PAGE

Create a dedicated SHAP explanation section.

Title:

“Why did the model make this prediction?”

Explain briefly:

“SHAP helps identify the words and features that contributed most to the model's prediction.”

Display:

Positive contributing words/features.

Example visual:

Feature Importance

network security ████████████
intrusion detection ██████████
malware ████████
encryption ██████

IMPORTANT:
The example values above are only UI examples. Real SHAP values must come from the backend.

Also provide:

Top contributing words

Feature importance chart

Explanation text

Model confidence

Add a disclaimer:

“SHAP explanations describe model behavior and should be interpreted as supporting information rather than absolute reasoning.”

7. FIGURE / VISUAL ANALYSIS

Display figures extracted from the PDF.

Create a gallery:

Figure 1
Figure 2
Figure 3
...

Allow the user to click a figure to view it larger.

Show:

Figure number

Caption

Visual embedding status

If visual processing information is returned by the backend, display it.

8. CITATIONS PAGE

Display extracted references/citations.

Features:

Search citations

Citation count

Reference list

Author

Year

Title

Use cards or a clean table.

Add filtering/search.

9. CONFERENCE RECOMMENDATION PAGE

Based on the predicted research field and paper content, recommend suitable conferences.

Each conference card should show:

Conference name
Research field
Match score
Submission deadline
Conference date
Location
Short description
Official website button

Example:

CVPR

Match Score: 94%

Field:
Computer Vision

Deadline:
[Backend-provided date]

Location:
[Backend-provided location]

Button:
“Official Conference Website”

IMPORTANT:
Do not invent conference deadlines or URLs.

If live conference information is unavailable, clearly show that the information could not be retrieved.

10. DASHBOARD

Create a dashboard showing:

Total Papers Analyzed

Research Field Distribution

Recent Analyses

Average Classification Confidence

Most Common Research Fields

Use professional charts.

Example:

Research Field Distribution

Machine Learning 34
NLP 29
Computer Vision 31
Information Retrieval 18
AI 16

The dashboard should use backend/database data when available.

11. HISTORY PAGE

Allow users to see previously analyzed papers.

Each history item should contain:

Paper title

Date analyzed

Predicted field

Confidence

Status

Buttons:

View Results

Delete

API INTEGRATION

Prepare the frontend for these API endpoints.

POST /api/analyze

Upload a PDF and return:

{
"paper_id": "...",
"title": "...",
"prediction": {
"field": "...",
"confidence": 0.874
},
"top_predictions": [],
"summary": {},
"metadata": {},
"shap": {},
"figures": [],
"citations": [],
"conferences": []
}

GET /api/papers/{paper_id}

Return complete analysis results.

GET /api/papers

Return analysis history.

DELETE /api/papers/{paper_id}

Delete an analysis.

GET /api/conferences

Return conference recommendations.

If the actual backend uses different endpoints, create a centralized API service layer so the endpoint URLs can easily be changed later.

Do not scatter API URLs throughout React components.

UI DESIGN

Use a professional academic/AI visual style.

Design requirements:

Clean

Modern

Minimal

Professional

Academic

AI-inspired

Lots of whitespace

Rounded cards

Subtle shadows

Smooth animations

Excellent typography

Responsive on laptop, tablet and mobile

Use a light theme as the primary design.

Suggested visual style:

White / off-white background
Dark text
Subtle blue/purple AI accents
Clean cards
Thin borders
Modern dashboard

Avoid:

Excessive gradients

Excessive animations

Neon colors

Gaming-style UI

Unnecessary decorative elements

The application should look appropriate for a university project demonstration.

NAVIGATION

Create a sidebar/dashboard navigation containing:

Dashboard
Analyze Paper
History
Conference Recommendations
About Project

Top bar:

Search
Notifications
User profile

On mobile, convert the sidebar into a responsive mobile navigation.

ABOUT PROJECT PAGE

Explain the project architecture:

PDF Research Paper
↓
Text Extraction + Figure Extraction
↓
SciBERT + Vision Transformer
↓
Multimodal Feature Fusion
↓
Dense + Softmax Classifier
↓
Research Field Prediction
↓
SHAP Explainability
↓
Conference Recommendation

Also include:

Problem Statement

Digital libraries contain huge collections of research papers. Keyword-based searching can produce irrelevant results because terminology overlaps across different domains and authors use different writing styles.

Project Objective

Build an AI-driven system that intelligently classifies research papers into research fields and assists researchers in discovering and organizing scientific literature.

Research Gap

Existing approaches often rely primarily on text or metadata and may not fully utilize visual information such as figures, tables, charts and equations.

Our approach combines:

SciBERT

Vision Transformer

Multimodal feature fusion

SHAP explainability

ERROR HANDLING

Handle:

Invalid PDF

File too large

Empty PDF

Backend unavailable

Processing failure

Timeout

Missing analysis data

Conference API failure

Show friendly error messages.

Example:

“Unable to analyze this paper right now. Please try again.”

Never show raw stack traces to normal users.

LOADING EXPERIENCE

Make the processing experience impressive for the project demonstration.

Show:

Analyzing Research Paper...

✓ PDF received
✓ Text extracted
✓ Figures extracted
✓ SciBERT processing
✓ ViT processing
✓ Feature fusion
✓ Classification completed
✓ SHAP explanation generated

Then automatically navigate to the results page.

IMPORTANT BACKEND RULE

The website must NOT fake AI results.

If the ML backend is unavailable, show an appropriate “Backend unavailable” message.

Do not create fake confidence scores, fake SHAP values, fake predictions, or fake conference deadlines in production mode.

For development/demo mode, create a clearly marked MOCK_MODE configuration that can be enabled separately.

CODE QUALITY

Use:

Reusable React components

TypeScript types/interfaces

Centralized API service

Environment variables

Proper error handling

Responsive design

Clean folder structure

Comments for important integration points

Create components such as:

PDFUploader
ProcessingStatus
PredictionCard
ConfidenceChart
TopPredictions
SHAPExplanation
PaperSummary
CitationList
FigureGallery
ConferenceCard
DashboardCharts
HistoryTable

FINAL REQUIREMENT

Build the complete application and make it visually polished.

Prioritize functionality in this order:

PDF upload

API integration

Research field prediction

Confidence visualization

SHAP explanation

Paper summary

Figure extraction display

Citation extraction

Conference recommendations

Dashboard and history

The final application should feel like a real AI-powered research assistant rather than a basic college-project CRUD website.

Use the project name:

ResearchAI

Tagline:

“From Chaos to Knowledge”

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b3aec1b3-70f3-5ffe-9caa-7c6af425eede).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
