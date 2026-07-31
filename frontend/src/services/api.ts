import {
  ResearchSession,
  DeepSearchResults,
  ProjectPlan,
  DashboardData,
  Workspace,
  Source
} from '../types';

// In-memory persistent state during session
let mockSessions: ResearchSession[] = [
  {
    sessionId: 'session-food-waste',
    ideaText: 'Reduce food waste in college hostels using IoT weight sensors and computer vision food recognition',
    createdAt: '2026-07-22T14:30:00Z',
    status: 'completed',
    sourcesCount: 12
  },
  {
    sessionId: 'session-fake-news',
    ideaText: 'Detect fake news in regional Indian languages using multi-lingual BERT fine-tuning and WhatsApp claim matching',
    createdAt: '2026-07-21T09:15:00Z',
    status: 'completed',
    sourcesCount: 16
  },
  {
    sessionId: 'session-microgrid',
    ideaText: 'Autonomous microgrid energy balancer using deep reinforcement learning on solar/battery storage nodes',
    createdAt: '2026-07-19T18:45:00Z',
    status: 'completed',
    sourcesCount: 14
  }
];

let mockWorkspaces: Workspace[] = [
  {
    workspaceId: 'ws-agri-sustainability',
    name: 'Food Systems & Smart Campus',
    itemCount: 4,
    updatedAt: '2 hours ago',
    description: 'Literature and IoT architectures for campus food waste reduction and organic recycling.',
    items: [
      {
        id: 'saved-1',
        sourceId: 'paper-1',
        title: 'IoT-Enabled Tray Waste Measurement in Academic Dining Facilities',
        snippet: 'Evaluates load cell arrays and edge camera modules for automated plate-waste monitoring in institutional cafeterias.',
        type: 'paper',
        url: 'https://doi.org/10.1016/j.resconrec.2025.107892',
        savedAt: '2026-07-22T15:00:00Z',
        citationIndex: 1
      },
      {
        id: 'saved-2',
        sourceId: 'github-1',
        title: 'food-vision-edge / food-waste-segmentation-yolov8',
        snippet: 'PyTorch implementation for lightweight food item classification and portion estimation on Raspberry Pi 4.',
        type: 'github',
        url: 'https://github.com/food-vision-edge/food-waste-segmentation-yolov8',
        savedAt: '2026-07-22T15:02:00Z',
        citationIndex: 3
      }
    ]
  },
  {
    workspaceId: 'ws-nlp-multilingual',
    name: 'NLP & Regional Language Fact-Checking',
    itemCount: 3,
    updatedAt: 'Yesterday',
    description: 'Benchmark datasets, IndicBERT fine-tuning repos, and cross-lingual rumor diffusion models.',
    items: [
      {
        id: 'saved-3',
        sourceId: 'paper-2',
        title: 'IndicFact: Low-Resource Fact Verification Across 11 Indic Languages',
        snippet: 'Presents a benchmark dataset of 45,000 verified claim-evidence pairs across Hindi, Tamil, Bengali, and Marathi.',
        type: 'paper',
        url: 'https://arxiv.org/abs/2403.11982',
        savedAt: '2026-07-21T10:00:00Z',
        citationIndex: 1
      }
    ]
  },
  {
    workspaceId: 'ws-renewable-energy',
    name: 'Smart Grids & Reinforcement Learning',
    itemCount: 2,
    updatedAt: '3 days ago',
    description: 'Gym environments and microgrid simulation tools for energy distribution control.',
    items: []
  }
];

// Pre-cooked deep search database for canonical examples
const deepSearchDatabase: Record<string, DeepSearchResults> = {
  'session-food-waste': {
    sessionId: 'session-food-waste',
    summary: `Addressing campus dining waste requires integrating real-time physical metering with computer vision classification [1]. Recent studies indicate that institutional dining halls generate over 140 kg of edible organic waste daily per 1,000 students [1]. By deploying strain-gauge load cell sensors under waste collection receptacles paired with low-latency edge camera inference (e.g., YOLOv8-nano), dining management can track precise waste weights correlated with recipe categories [2] [3].\n\nExisting open-source approaches utilize localized edge devices (Raspberry Pi 5 or Jetson Orin Nano) to process video frames, detecting leftover food types and estimating mass via stereoscopic depth maps [3] [4]. Coupling these metrics with student preference polling APIs allows predictive dining menu adjustments, reducing over-preparation by an estimated 28–34% over a 12-week operational cycle [2] [5].`,
    sources: [
      {
        id: 'src-fw-1',
        type: 'paper',
        title: 'IoT-Enabled Tray Waste Measurement in Academic Dining Facilities',
        snippet: 'Evaluates load cell arrays and edge camera modules for automated plate-waste monitoring in institutional cafeterias with 92.4% accuracy.',
        url: 'https://doi.org/10.1016/j.resconrec.2025.107892',
        citationIndex: 1,
        authors: 'S. Patel, M. Zhang et al. (Journal of Cleaner Production)',
        publishedYear: '2025'
      },
      {
        id: 'src-fw-2',
        type: 'web',
        title: 'FAO Circular Economy Framework for Educational Institutions',
        snippet: 'Standardized protocols for quantifying kitchen prep waste vs post-consumer plate waste in high-volume cafeterias.',
        url: 'https://www.fao.org/food-loss-and-waste/guidelines-colleges',
        citationIndex: 2
      },
      {
        id: 'src-fw-3',
        type: 'github',
        title: 'food-vision-edge / food-waste-segmentation-yolov8',
        snippet: 'PyTorch implementation for lightweight food item classification and portion estimation on Raspberry Pi 4 & Jetson Orin Nano.',
        url: 'https://github.com/food-vision-edge/food-waste-segmentation-yolov8',
        citationIndex: 3,
        stars: 482
      },
      {
        id: 'src-fw-4',
        type: 'github',
        title: 'open-smart-cafeteria / loadcell-telemetry-broker',
        snippet: 'MQTT microservice for streaming HX711 amplifier strain gauge data into local InfluxDB time-series instances.',
        url: 'https://github.com/open-smart-cafeteria/loadcell-telemetry-broker',
        citationIndex: 4,
        stars: 189
      },
      {
        id: 'src-fw-5',
        type: 'paper',
        title: 'Predictive Demand Forecasting in University Food Services using LSTM Networks',
        snippet: 'Demonstrates a 31% reduction in meal over-cooking through historic attendance and weather feature correlations.',
        url: 'https://arxiv.org/abs/2405.09114',
        citationIndex: 5,
        authors: 'A. Rao, K. Takahashi (IEEE Access)',
        publishedYear: '2024'
      }
    ]
  },
  'session-fake-news': {
    sessionId: 'session-fake-news',
    summary: `Misinformation propagation in Indic regional languages presents significant cross-lingual transfer challenges due to morphological richness and limited annotated datasets [1]. Fine-tuning multi-lingual transformer architectures (IndicBERT v2 and XLM-RoBERTa) on domain-specific claim-evidence pairs allows multi-modal verification across text and OCR-extracted meme imagery [1] [2].\n\nReal-time claim matching relies on vector similarity indexing (Faiss or Qdrant) over verified fact-checking databases like AltNews and BoomFact Check [3]. When a user forwards a audio or text message, a lightweight multi-stage pipeline extracts key entities, generates dense semantic embeddings, and flags matched debunks within sub-100ms latency [3] [4].`,
    sources: [
      {
        id: 'src-fn-1',
        type: 'paper',
        title: 'IndicFact: Low-Resource Fact Verification Across 11 Indic Languages',
        snippet: 'Presents a benchmark dataset of 45,000 verified claim-evidence pairs across Hindi, Tamil, Bengali, and Marathi.',
        url: 'https://arxiv.org/abs/2403.11982',
        citationIndex: 1,
        authors: 'R. Sharma, B. Gupta (ACL 2024)',
        publishedYear: '2024'
      },
      {
        id: 'src-fn-2',
        type: 'github',
        title: 'ai4bharat / IndicBERT-v2-FactCheck',
        snippet: 'Fine-tuned IndicBERT transformer models for sentence-level stance detection and claim verification in regional dialects.',
        url: 'https://github.com/ai4bharat/IndicBERT-v2-FactCheck',
        citationIndex: 2,
        stars: 1240
      },
      {
        id: 'src-fn-3',
        type: 'web',
        title: 'WhatsApp Business API Webhook Integration for Fact-Checking Bots',
        snippet: 'Official architecture guide for routing multimedia incoming webhooks to cloud vector search endpoints.',
        url: 'https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks',
        citationIndex: 3
      },
      {
        id: 'src-fn-4',
        type: 'github',
        title: 'qdrant / IndicClaim-semantic-search-demo',
        snippet: 'Sub-millisecond vector similarity search pipeline indexing 100k verified debunk articles with multilingual embeddings.',
        url: 'https://github.com/qdrant/IndicClaim-semantic-search-demo',
        citationIndex: 4,
        stars: 615
      }
    ]
  }
};

const projectPlanDatabase: Record<string, ProjectPlan> = {
  'session-food-waste': {
    sessionId: 'session-food-waste',
    architecture: `+-------------------------------------------------------------------------+
|                        HOSTEL CAFETERIA EDGE LAYER                      |
|  [ HX711 Load Cell Array ]       [ Jetson Orin Nano / RPi 5 Camera ]   |
|         (Weight Data)                     (Food Classification)         |
+------------------------------------+------------------------------------+
                                     | MQTT / HTTP TLS
                                     v
+-------------------------------------------------------------------------+
|                        CENTRAL INGESTION & ANALYTICS                    |
|  [ Node.js MQTT Telemetry Broker ] --> [ FastAPI Inference Pipeline ]   |
|                                                  |                      |
|                                                  v                      |
|                                       [ PostgreSQL + TimescaleDB ]     |
+--------------------------------------------------+----------------------+
                                                   | GraphQL / REST API
                                                   v
+-------------------------------------------------------------------------+
|                         STUDENT & ADMIN DASHBOARD                       |
|  [ React + Tailwind Web App ]  <--> [ Push Notifications / Alerts ]     |
+-------------------------------------------------------------------------+`,
    techStack: [
      { category: 'Edge Hardware & Firmware', items: ['Raspberry Pi 5 / Jetson Orin', 'HX711 Strain Gauge Sensor', 'MicroPython / C++'] },
      { category: 'Computer Vision & AI', items: ['PyTorch 2.3', 'YOLOv8 Small Food Model', 'OpenCV', 'ONNX Runtime'] },
      { category: 'Backend & Ingestion', items: ['Node.js + Express', 'Mosquitto MQTT Broker', 'FastAPI Python'] },
      { category: 'Database & Storage', items: ['PostgreSQL 16', 'TimescaleDB (Time-series)', 'MinIO (Image Artifacts)'] },
      { category: 'Frontend Web App', items: ['React 19', 'Tailwind CSS v4', 'Recharts / D3.js', 'Lucide Icons'] }
    ],
    milestones: [
      {
        title: 'Phase 1: Hardware Benchmarking & Calibration',
        description: 'Construct 4-point load cell scale platform and calibrate HX711 ADC readings against known weights up to 25kg.',
        estimatedDate: 'Weeks 1 – 2',
        complexity: 'Low',
        deliverables: ['Calibrated load cell kit', 'MicroPython MQTT telemetry script']
      },
      {
        title: 'Phase 2: Dataset Collection & YOLO Fine-tuning',
        description: 'Annotate 1,500 images of cafeteria food items (rice, curry, bread, salad) and train YOLOv8 model for edge inference.',
        estimatedDate: 'Weeks 3 – 5',
        complexity: 'High',
        deliverables: ['Custom Roboflow dataset', 'Quantized ONNX model file (< 45MB)']
      },
      {
        title: 'Phase 3: Real-time Telemetry Pipeline Integration',
        description: 'Build Express backend service linking strain gauge weight changes with food class bounding boxes to compute grams wasted per item.',
        estimatedDate: 'Weeks 6 – 8',
        complexity: 'Medium',
        deliverables: ['TimescaleDB schema', 'MQTT-to-PostgreSQL pipeline script']
      },
      {
        title: 'Phase 4: Admin Analytics & Kitchen Menu Recommender',
        description: 'Develop responsive React dashboard displaying daily waste trends, waste cost analytics, and chef menu adjustment insights.',
        estimatedDate: 'Weeks 9 – 12',
        complexity: 'Medium',
        deliverables: ['Production React Web App', 'Weekly automated PDF report generator']
      }
    ],
    apisAndDatasets: [
      {
        name: 'Food101 / Food Segmentation Dataset',
        type: 'dataset',
        description: '101 food categories with 101,000 images for visual classification fine-tuning.',
        link: 'https://www.vision.ee.ethz.ch/datasets_extra/food-101/',
        license: 'CC BY-NC 4.0'
      },
      {
        name: 'USDA Food Data Central API',
        type: 'api',
        description: 'Nutritional and weight conversion metadata for standardized food items.',
        link: 'https://fdc.nal.usda.gov/api-guide.html',
        license: 'Open Access / US Public Domain'
      },
      {
        name: 'OpenWeatherMap API',
        type: 'api',
        description: 'Historical and forecast weather data to correlate campus dining attendance with rain/temperature.',
        link: 'https://openweathermap.org/api',
        license: 'Developer Free Tier'
      }
    ]
  },
  'session-fake-news': {
    sessionId: 'session-fake-news',
    architecture: `+-------------------------------------------------------------------------+
|                          INPUT CHANNELS LAYER                           |
|  [ WhatsApp Business Webhook ]   [ Web Chrome Extension ]  [ Mobile App ]|
+------------------------------------+------------------------------------+
                                     | HTTPS Webhook Request
                                     v
+-------------------------------------------------------------------------+
|                      PROCESSING & EMBEDDING PIPELINE                    |
|  [ FastAPI Ingestion Gateway ] --> [ Tesseract OCR / Whisper Audio ]    |
|                                                |                        |
|                                                v                        |
|                              [ IndicBERT v2 Vectorizer ]               |
+------------------------------------------------+------------------------+
                                                 | Dense Vector (768d)
                                                 v
+-------------------------------------------------------------------------+
|                      SIMILARITY SEARCH & FACT ENGINE                    |
|  [ Qdrant Vector DB (100k Verified Debunks) ] --> [ Ststance Classifier ]|
|                                                         |               |
|                                                         v               |
|                                             [ Verified Stance Result ]  |
+---------------------------------------------------------+---------------+
                                                          | Response JSON
                                                          v
+-------------------------------------------------------------------------+
|                     USER EXPLANATION & VERDICT CARD                     |
|  [ Confidence Score: 94% ] [ Citation Links [1] [2] ] [ Language: Hindi]|
+-------------------------------------------------------------------------+`,
    techStack: [
      { category: 'Multilingual AI Models', items: ['IndicBERT v2', 'XLM-RoBERTa', 'Whisper Multilingual (Speech-to-Text)', 'Tesseract OCR'] },
      { category: 'Vector Index & Search', items: ['Qdrant / Faiss', 'Sentence-Transformers', 'Hugging Face Transformers'] },
      { category: 'Backend Architecture', items: ['Python FastAPI', 'Celery + Redis Task Queue', 'Docker'] },
      { category: 'Database Layer', items: ['PostgreSQL (Fact Repository)', 'Redis (Recent Hash Cache)'] },
      { category: 'Frontend Interface', items: ['React 19', 'Tailwind CSS', 'WhatsApp Bot Interface', 'Chrome Extension Manifest v3'] }
    ],
    milestones: [
      {
        title: 'Milestone 1: Fact-Checking Corpus Aggregation',
        description: 'Scrape and standardize 25,000 verified debunks from certified fact-checkers in Hindi, Tamil, and English.',
        estimatedDate: 'Weeks 1 – 3',
        complexity: 'Medium',
        deliverables: ['Cleaned Parquet dataset', 'Automated daily fact scraping crawler']
      },
      {
        title: 'Milestone 2: Multi-modal Vector Index Construction',
        description: 'Encode text claims and OCR image transcriptions into 768-dimensional Qdrant vector spaces.',
        estimatedDate: 'Weeks 4 – 6',
        complexity: 'High',
        deliverables: ['Qdrant vector cluster', 'Sub-50ms cosine similarity benchmarks']
      },
      {
        title: 'Milestone 3: WhatsApp Webhook & Verification Bot',
        description: 'Deploy FastAPI server receiving forwarded user messages and generating structured claim verification summary cards.',
        estimatedDate: 'Weeks 7 – 9',
        complexity: 'High',
        deliverables: ['WhatsApp Cloud API integration', 'Automated response flow with source links']
      }
    ],
    apisAndDatasets: [
      {
        name: 'IndicFact Verification Corpus',
        type: 'dataset',
        description: 'Benchmark dataset containing claim-evidence pairs in 11 Indic languages.',
        link: 'https://huggingface.co/datasets/indicfact',
        license: 'MIT'
      },
      {
        name: 'WhatsApp Cloud API',
        type: 'api',
        description: 'Official API for sending and receiving messages on WhatsApp numbers.',
        link: 'https://developers.facebook.com/docs/whatsapp/cloud-api',
        license: 'Meta Business Developer Terms'
      }
    ]
  }
};

// Dynamic Fallback Generator for any custom project idea entered by the user!
function generateDynamicDeepSearch(sessionId: string, ideaText: string): DeepSearchResults {
  const keywords = ideaText.split(' ').filter(w => w.length > 3).slice(0, 4);
  const coreConcept = keywords.join(' ') || 'innovation project';

  return {
    sessionId,
    summary: `Research into "${ideaText}" highlights significant potential for automated, data-driven optimization [1]. Modern implementations leverage modular client-server architectures paired with specialized AI/ML inference pipelines to streamline end-to-end user workflows [1] [2]. Critical considerations include low-latency execution, clean API abstraction layers, and robust data schema persistence [2] [3].\n\nRecent peer-reviewed studies and active open-source initiatives demonstrate that combining modern frontend frameworks with containerized backend services reduces integration overhead by up to 40% [3] [4]. Furthermore, benchmark implementations emphasize the necessity of structured telemetry logging, rigorous error boundary handling, and clear open-source dataset pipelines for evaluation [4] [5].`,
    sources: [
      {
        id: `src-gen-1`,
        type: 'paper',
        title: `Architectural Paradigms for ${coreConcept.toUpperCase()}: A Systematic Review`,
        snippet: `Comprehensive benchmark evaluating state-of-the-art algorithms, system throughput, and domain-specific edge deployment techniques.`,
        url: `https://arxiv.org/abs/2501.04891`,
        citationIndex: 1,
        authors: 'D. Kumar, E. Roberts et al. (ACM Computing Surveys)',
        publishedYear: '2025'
      },
      {
        id: `src-gen-2`,
        type: 'github',
        title: `open-research-lab / ${keywords[0] || 'core'}-${keywords[1] || 'engine'}-framework`,
        snippet: `Production-ready TypeScript & Python repository providing modular pipelines, benchmark suites, and Docker container configurations.`,
        url: `https://github.com/open-research-lab/${keywords[0] || 'core'}-engine`,
        citationIndex: 2,
        stars: 730
      },
      {
        id: `src-gen-3`,
        type: 'web',
        title: `IEEE Standards Guide: Best Practices for Building ${coreConcept}`,
        snippet: `Engineering specifications, security protocols, and dataset preparation guidelines for academic and industry prototypes.`,
        url: `https://ieee.org/standards/guide-${keywords[0] || 'tech'}`,
        citationIndex: 3
      },
      {
        id: `src-gen-4`,
        type: 'paper',
        title: `Scalable Microservice Architectures for Distributed ${keywords[0] || 'System'} Execution`,
        snippet: `Empirical study analyzing system response latency, fault tolerance, and API throughput under high concurrency workloads.`,
        url: `https://doi.org/10.1145/3610000.3610123`,
        citationIndex: 4,
        authors: 'J. Vance, L. Miller (IEEE Trans. Software Eng.)',
        publishedYear: '2024'
      },
      {
        id: `src-gen-5`,
        type: 'github',
        title: `awesome-research-tools / ${keywords[0] || 'awesome'}-dataset-collection`,
        snippet: `Curated list of public APIs, open domain datasets, and evaluation metrics tailored for ${ideaText.slice(0, 30)}...`,
        url: `https://github.com/awesome-research-tools/datasets`,
        citationIndex: 5,
        stars: 1420
      }
    ]
  };
}

function generateDynamicProjectPlan(sessionId: string, ideaText: string): ProjectPlan {
  const keywords = ideaText.split(' ').filter(w => w.length > 3);
  const tag1 = keywords[0] ? keywords[0].toLowerCase() : 'system';
  const tag2 = keywords[1] ? keywords[1].toLowerCase() : 'service';

  return {
    sessionId,
    architecture: `+-------------------------------------------------------------------------+
|                           CLIENT PRESENTATION LAYER                     |
|  [ React 19 + Tailwind CSS Web UI ] <--> [ Mobile / Extension Client ]  |
+------------------------------------+------------------------------------+
                                     | REST / GraphQL API Requests
                                     v
+-------------------------------------------------------------------------+
|                        API GATEWAY & INGESTION                          |
|  [ Node.js Express Server / FastAPI ] --> [ Authentication & Rate Limit ]|
|                                                  |                      |
|                                                  v                      |
|                                    [ Async Job Queue (Redis / Celery) ]|
+--------------------------------------------------+----------------------+
                                                   | Microservice IPC
                                                   v
+-------------------------------------------------------------------------+
|                      CORE MODEL & ANALYTICS ENGINE                      |
|  [ Specialized AI/ML Model Pipeline ] <--> [ Vector Search / Knowledge DB]|
|                                                  |                      |
|                                                  v                      |
|                                       [ PostgreSQL Persistent DB ]      |
+-------------------------------------------------------------------------+`,
    techStack: [
      { category: 'Frontend Interface', items: ['React 19', 'Tailwind CSS v4', 'Lucide Icons', 'Motion (Framer)', 'Vite'] },
      { category: 'Backend & Services', items: ['Node.js Express / Python FastAPI', 'TypeScript', 'REST & WebSocket'] },
      { category: 'AI & Data Processing', items: [`PyTorch / HuggingFace Transformers`, `Scikit-Learn`, `Pandas & NumPy`] },
      { category: 'Database & Caching', items: ['PostgreSQL 16', 'Redis Cache', 'ChromaDB / Qdrant Vector Index'] },
      { category: 'DevOps & Testing', items: ['Docker & Docker Compose', 'GitHub Actions CI/CD', 'Jest / PyTest'] }
    ],
    milestones: [
      {
        title: 'Milestone 1: Requirement Specification & Data Schema',
        description: `Define exact relational schema, API endpoints, and acquire baseline open training data for ${tag1}.`,
        estimatedDate: 'Weeks 1 – 2',
        complexity: 'Low',
        deliverables: ['Architecture Blueprint Document', 'Initial Database Migration Scripts']
      },
      {
        title: 'Milestone 2: Core Algorithm & Pipeline Prototyping',
        description: `Implement the primary analysis pipeline for ${tag2} and conduct benchmark evaluation tests.`,
        estimatedDate: 'Weeks 3 – 5',
        complexity: 'High',
        deliverables: ['Trained Model Checkpoint', 'Evaluation Metrics Notebook (Precision/Recall > 88%)']
      },
      {
        title: 'Milestone 3: Full-Stack API Integration',
        description: `Connect client user interfaces with backend API microservices and set up real-time status updates.`,
        estimatedDate: 'Weeks 6 – 8',
        complexity: 'Medium',
        deliverables: ['Interactive React UI Component Suite', 'API Documentation & OpenAPI Specs']
      },
      {
        title: 'Milestone 4: Deployment & User Testing',
        description: `Package into Docker containers, deploy to cloud staging environment, and run usability tests with students.`,
        estimatedDate: 'Weeks 9 – 10',
        complexity: 'Low',
        deliverables: ['Live Cloud Staging Link', 'Final Research Poster & GitHub Documentation']
      }
    ],
    apisAndDatasets: [
      {
        name: `Open Domain ${tag1.toUpperCase()} Dataset`,
        type: 'dataset',
        description: `Structured benchmark dataset for evaluating accuracy and system efficiency.`,
        link: `https://huggingface.co/datasets/search?q=${encodeURIComponent(tag1)}`,
        license: 'CC BY 4.0'
      },
      {
        name: `Gemini / HuggingFace Inference API`,
        type: 'api',
        description: `High-throughput natural language synthesis and vector embedding extraction endpoint.`,
        link: 'https://ai.google.dev/gemini-api/docs',
        license: 'API Key Access'
      }
    ]
  };
}

// === REQUIRED SERVICE EXPORTS WITH EXACT SIGNATURES ===

/**
 * POST equivalent - submits idea, returns a session
 */
export async function createResearchSession(ideaText: string): Promise<ResearchSession> {
  // Simulate network processing delay (600ms)
  await new Promise(resolve => setTimeout(resolve, 600));

  const sessionId = 'session-' + Date.now();
  const newSession: ResearchSession = {
    sessionId,
    ideaText,
    createdAt: new Date().toISOString(),
    status: 'completed',
    sourcesCount: Math.floor(Math.random() * 8) + 10
  };

  mockSessions.unshift(newSession);

  // Generate dynamic search results and project plan for new session
  deepSearchDatabase[sessionId] = generateDynamicDeepSearch(sessionId, ideaText);
  projectPlanDatabase[sessionId] = generateDynamicProjectPlan(sessionId, ideaText);

  return newSession;
}

/**
 * GET - fetch deep search results once processing done
 */
export async function getDeepSearchResults(sessionId: string): Promise<DeepSearchResults> {
  await new Promise(resolve => setTimeout(resolve, 400));

  if (deepSearchDatabase[sessionId]) {
    return deepSearchDatabase[sessionId];
  }

  // Fallback if session ID unknown
  const session = mockSessions.find(s => s.sessionId === sessionId);
  const text = session ? session.ideaText : 'Custom Innovation Idea';
  return generateDynamicDeepSearch(sessionId, text);
}

/**
 * GET - fetch project plan for session
 */
export async function getProjectPlan(sessionId: string): Promise<ProjectPlan> {
  await new Promise(resolve => setTimeout(resolve, 400));

  if (projectPlanDatabase[sessionId]) {
    return projectPlanDatabase[sessionId];
  }

  const session = mockSessions.find(s => s.sessionId === sessionId);
  const text = session ? session.ideaText : 'Custom Innovation Idea';
  return generateDynamicProjectPlan(sessionId, text);
}

/**
 * GET - fetch dashboard summary data for user
 */
export async function getDashboardData(userId: string = 'user-student-1'): Promise<DashboardData> {
  await new Promise(resolve => setTimeout(resolve, 350));

  const totalSources = mockSessions.reduce((acc, s) => acc + (s.sourcesCount || 12), 0);

  return {
    stats: {
      ideasExplored: mockSessions.length,
      sourcesAnalyzed: totalSources,
      plansGenerated: mockSessions.filter(s => s.status === 'completed').length
    },
    sessions: [...mockSessions]
  };
}

/**
 * GET - fetch user workspaces
 */
export async function getWorkspaces(userId: string = 'user-student-1'): Promise<Workspace[]> {
  await new Promise(resolve => setTimeout(resolve, 350));

  return [...mockWorkspaces];
}

/**
 * POST - save source item to specific workspace
 */
export async function saveToWorkspace(workspaceId: string, sourceId: string): Promise<{ success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const workspace = mockWorkspaces.find(w => w.workspaceId === workspaceId);
  if (!workspace) {
    return { success: false };
  }

  // Find source in deep search database
  let foundSource: Source | undefined;
  for (const key in deepSearchDatabase) {
    const src = deepSearchDatabase[key].sources.find(s => s.id === sourceId);
    if (src) {
      foundSource = src;
      src.workspaceSaved = true;
      break;
    }
  }

  if (foundSource) {
    if (!workspace.items) workspace.items = [];
    const alreadyExists = workspace.items.some(item => item.sourceId === sourceId);
    if (!alreadyExists) {
      workspace.items.push({
        id: 'saved-' + Date.now(),
        sourceId: foundSource.id,
        title: foundSource.title,
        snippet: foundSource.snippet,
        type: foundSource.type,
        url: foundSource.url,
        savedAt: new Date().toISOString(),
        citationIndex: foundSource.citationIndex
      });
      workspace.itemCount = workspace.items.length;
      workspace.updatedAt = 'Just now';
    }
  }

  return { success: true };
}

// Extra helper for user creating a custom workspace dynamically
export async function createNewWorkspace(name: string, description: string = ''): Promise<Workspace> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const newWs: Workspace = {
    workspaceId: 'ws-' + Date.now(),
    name,
    description: description || 'Collection of saved literature, GitHub repos, and Web sources.',
    itemCount: 0,
    updatedAt: 'Just now',
    items: []
  };

  mockWorkspaces.unshift(newWs);
  return newWs;
}

// Extra helper for deleting item from workspace
export async function removeFromWorkspace(workspaceId: string, savedItemId: string): Promise<{ success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 250));

  const workspace = mockWorkspaces.find(w => w.workspaceId === workspaceId);
  if (workspace && workspace.items) {
    workspace.items = workspace.items.filter(i => i.id !== savedItemId);
    workspace.itemCount = workspace.items.length;
    workspace.updatedAt = 'Just now';
    return { success: true };
  }
  return { success: false };
}
