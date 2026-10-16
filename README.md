# ResearchAI – Intelligent Research Paper Classification System

ResearchAI is an AI-powered web application designed to automatically analyze and classify scientific research papers using **SciBERT, Vision Transformer (ViT), Multimodal Feature Fusion, and Explainable AI (SHAP)**.

The system allows users to upload research papers in PDF format and obtain research field predictions, confidence scores, paper summaries, extracted metadata, figures, citations, and conference recommendations through an interactive web interface.

The application uses a React frontend connected to a Python FastAPI backend, which handles PDF processing, machine learning inference, and analysis results.

> **Note:** Actual predictions, confidence scores, SHAP explanations, and conference information must come from the connected backend or verified data sources. The application must not generate fake AI results. Mock mode, if implemented, should be clearly labelled and disabled by default.

## Table of Contents

- Project Overview
- Problem Statement
- Project Objectives
- Research Gap
- Key Features
- Research Categories
- System Architecture
- Technology Stack
- Project Structure
- Installation and Setup
- Environment Configuration
- API Integration
- Analysis Workflow
- Error Handling
- Future Enhancements
- References

## 1. Project Overview

Scientific digital libraries contain thousands of research papers across different domains. Manually reading, organizing, and classifying these papers can be time-consuming. Traditional keyword-based approaches may also struggle when different research fields share similar terminology.

ResearchAI aims to simplify this process by analyzing both the textual and visual content of scientific papers. The system uses SciBERT to process scientific text and a Vision Transformer (ViT) to process visual information such as figures and diagrams. Their representations are combined through multimodal feature fusion before the classification model predicts the research field.

SHAP-based explainability helps users understand which supported features contributed to a prediction. Additional features provide paper summaries, extracted references, metadata, and conference recommendations.

## 2. Problem Statement

Digital libraries contain huge collections of research papers. Keyword-based searching can produce irrelevant results because terminology overlaps across different domains and authors use different writing styles. Researchers need an intelligent system that can automatically classify papers, identify their main contributions, and assist in organizing scientific literature.

## 3. Project Objectives

- Develop a user-friendly web application for uploading scientific research papers in PDF format.
- Classify research papers into relevant research fields using the existing machine learning model.
- Process textual information using SciBERT.
- Process visual information using Vision Transformer (ViT).
- Combine textual and visual representations using multimodal feature fusion.
- Display prediction confidence and alternative classifications.
- Provide SHAP-based explanations when supported by the backend.
- Generate paper summaries and extract useful metadata, figures, and citations.
- Recommend suitable conferences using available and verified information.
- Provide a dashboard and analysis history for managing previously analyzed papers.

## 4. Research Gap

Many existing research paper classification approaches primarily rely on textual content, keywords, or metadata. These methods may not fully utilize the information contained in figures, diagrams, charts, and other visual elements of scientific papers.

ResearchAI is designed to address this limitation by combining scientific text representations from SciBERT with visual representations from ViT. Multimodal feature fusion enables the classification model to use both types of information when supported by the implemented pipeline.

The addition of SHAP explainability aims to improve transparency by showing the features associated with the model's predictions.

## 5. Key Features

### 5.1 AI Research Classification
- Upload scientific papers in PDF format.
- Predict the research field using the connected ML backend.
- Display the predicted class and confidence score.
- Show alternative predictions when available.

### 5.2 Multimodal Analysis
- Extract text from research papers.
- Extract figures and other visual elements.
- Generate text representations using SciBERT.
- Generate visual representations using ViT.
- Combine representations through multimodal feature fusion.

### 5.3 Explainable AI
- Display SHAP-based explanations when returned by the backend.
- Visualize important words or features.
- Provide feature-importance charts and explanation text.
- Help users interpret the factors associated with model predictions.

SHAP explanations describe model behavior and should be interpreted as supporting information rather than absolute reasoning.

### 5.4 Paper Summarization
- Generate a short summary.
- Identify key contributions.
- Present the methodology.
- Summarize main findings.
- Identify the research area.

### 5.5 Metadata and Citation Extraction
- Extract paper title, authors, abstract, and keywords.
- Display publication information and page count when available.
- Extract references and citations.
- Provide search and filtering options for reference lists.

### 5.6 Figure and Visual Analysis
- Display figures extracted from the uploaded PDF.
- Show figure numbers and captions when available.
- Allow users to view figures at a larger size.
- Display visual processing status when provided by the backend.

### 5.7 Conference Recommendations
- Recommend conferences based on paper content and predicted research field.
- Display match scores and research areas.
- Show submission deadlines, conference dates, locations, and descriptions when verified information is available.
- Provide official conference links when supplied by a reliable source.

### 5.8 Dashboard and History
- Display total papers analyzed.
- Visualize research field distribution.
- Show recent analyses and classification confidence.
- Maintain analysis history when backend persistence is available.
- Allow users to view or delete previous analyses when supported by the API.

## 6. Supported Research Categories

The intended research categories include:

- Machine Learning
- Natural Language Processing
- Computer Vision
- Information Retrieval
- Artificial Intelligence
- Language Models / Machine Learning
- General AI

The categories displayed by the frontend must match the actual class labels supported by the trained backend model.

## 7. System Architecture

The proposed system follows this workflow:

1. **PDF Upload:** The user uploads a scientific research paper.
2. **Text Extraction:** The backend extracts readable text from the PDF.
3. **Figure Extraction:** Relevant figures and visual elements are extracted.
4. **SciBERT Processing:** Scientific text is converted into contextual representations.
5. **ViT Processing:** Visual inputs are converted into visual representations.
6. **Multimodal Feature Fusion:** Textual and visual representations are combined.
7. **Classification:** The model predicts the research field.
8. **SHAP Explainability:** The system generates explanations when supported by the backend.
9. **Research Insights:** The application displays summaries, metadata, figures, citations, and conference recommendations.

## 8. Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend application |
| TypeScript | Type-safe application development |
| Tailwind CSS | Responsive styling |
| shadcn/ui | Reusable UI components |
| Lucide | Interface icons |
| Recharts | Charts and data visualization |
| Python | Backend and ML integration |
| FastAPI | REST API |
| SciBERT | Scientific text representation |
| Vision Transformer (ViT) | Visual representation |
| Multimodal Feature Fusion | Combines text and visual features |
| SHAP | Model explainability |

The existing ML architecture is retained. The frontend communicates with the Python backend through a centralized API service.


## 12. API Integration

The frontend is designed to communicate with the backend through a centralized API service. The following endpoints represent the proposed API contract and may need adjustment to match the existing backend.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/analyze` | Upload and analyze a PDF |
| GET | `/api/papers/{paper_id}` | Retrieve complete analysis results |
| GET | `/api/papers` | Retrieve analysis history |
| DELETE | `/api/papers/{paper_id}` | Delete an analysis |
| GET | `/api/conferences` | Retrieve conference recommendations |

### Example Analysis Response

```json
{
  "paper_id": "server-generated-id",
  "title": "Title returned by the backend",
  "prediction": {
    "field": "Computer Vision",
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
```

This is an illustrative response structure, not a real model prediction.

### Integration Requirements

- Upload the PDF using `multipart/form-data`.
- Keep endpoint URLs in the API service layer.
- Use TypeScript interfaces to validate response structures.
- Convert confidence values correctly for display.
- Display unavailable metadata as “Not available.”
- Show SHAP charts only when valid backend explanation data exists.
- Use verified conference deadlines and official URLs.
- Handle network failures, timeouts, and malformed responses.
- Configure FastAPI CORS to allow the frontend origin.

## 13. Error Handling

The application should provide friendly error messages for common situations.

| Situation | Message |
|---|---|
| Invalid file type | Please upload a PDF file. |
| File too large | This file is too large. Please choose a smaller PDF. |
| Empty or unreadable PDF | We couldn't extract readable content from this PDF. |
| Backend unavailable | The analysis service is unavailable. Please try again later. |
| Processing failure | Unable to analyze this paper right now. Please try again. |
| Timeout | Analysis is taking longer than expected. Please try again. |
| Missing metadata | Not available |
| Missing SHAP data | Explanation data is not available for this analysis. |
| Conference service failure | Conference information could not be retrieved. |

Raw stack traces and internal server errors should not be exposed to users.

Progress indicators should reflect actual backend progress when available. If the API only returns a final result, the frontend should use a loading indicator without falsely claiming that individual model stages have completed.

## 14. Security and Privacy

- Validate PDF type and file size on both frontend and backend.
- Treat uploaded documents as untrusted input.
- Enforce backend request limits and timeouts.
- Do not expose private credentials in frontend code.
- Configure CORS for trusted origins in production.
- Implement authentication and authorization if user-specific history is supported.
- Establish appropriate retention and deletion policies for uploaded documents.
- Avoid logging sensitive document contents unnecessarily.
- Keep software dependencies updated.

## 15. Testing Checklist

Before demonstrating the application, verify the following:

- [ ] PDF upload works correctly.
- [ ] Invalid, oversized, and unreadable files are handled.
- [ ] The frontend displays real backend predictions.
- [ ] Confidence scores match the backend response.
- [ ] Alternative predictions appear only when provided.
- [ ] SHAP values are taken from actual explanation results.
- [ ] Summary and metadata correspond to the uploaded paper.
- [ ] Extracted figures and citations are displayed correctly.
- [ ] Conference information is verified or marked unavailable.
- [ ] Backend failures do not generate fake predictions.
- [ ] Dashboard and history use real stored data when available.
- [ ] Mock/demo mode is visibly labelled.
- [ ] The interface works on desktop, tablet, and mobile.

## 16. Future Enhancements

- Batch processing of research papers.
- User authentication and personal research libraries.
- Semantic search and paper similarity recommendations.
- Exportable research analysis reports.
- Improved progress reporting using backend events.
- Integration with verified conference databases.
- Model version tracking and evaluation dashboards.
- Comprehensive evaluation on held-out datasets.
- Support for additional research categories and languages.

## 17. Conclusion

ResearchAI aims to make scientific literature analysis more efficient by combining multimodal research paper classification with explainability and research discovery features. Its planned integration of SciBERT, Vision Transformer, multimodal feature fusion, and SHAP provides a framework for analyzing scientific text and visual content while presenting results through a user-friendly web application.

The effectiveness of the system depends on the trained model, dataset quality, evaluation results, and successful backend integration. The application is intended to support research organization and discovery rather than replace expert academic judgment.

## 18. References and Documentation

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [Recharts Documentation](https://recharts.org/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Hugging Face Transformers Documentation](https://huggingface.co/docs/transformers/)
- [SHAP Documentation](https://shap.readthedocs.io/)

