"""Builds the resume as DOCX and as print-ready HTML from one content model."""
import sys, html
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

DOCX_OUT, HTML_OUT = sys.argv[1], sys.argv[2]

# ─────────────────────────── content ───────────────────────────
NAME = 'SHUBHAM KULKARNI'
TITLE = 'AI Engineer  |  Computer Vision  ·  Edge AI  ·  Generative AI & RAG  ·  MLOps'
CONTACT = [
    [('Pune, Maharashtra, India', None), ('+91 83080 03684', None),
     ('21shubhamkulkarni@gmail.com', 'mailto:21shubhamkulkarni@gmail.com')],
    [('linkedin.com/in/shubhkulk21', 'https://www.linkedin.com/in/shubhkulk21/'),
     ('github.com/kulkarnishub377', 'https://github.com/kulkarnishub377'),
     ('shubhamkulkarni.me', 'https://shubhamkulkarni.me')],
]
SUMMARY = [
    ('AI Engineer who designs and ships production computer vision and generative AI systems for national highway '
     'infrastructure. Core engineer on ', False), ('VIDES', True),
    (', an edge traffic-enforcement network on NVIDIA Jetson (14 detection types, 7 models per node, 50,000+ events/day '
     'at 95% accuracy, sub-40 ms frame processing), and ', False), ('TMCS', True),
    (', an NHAI ATMS-aligned incident-detection platform with court-grade evidence. Owns systems end to end — TensorRT '
     'model optimization, multi-object tracking, real-time streaming, data pipelines, access control and CI/CD — and '
     'builds RAG, hybrid-search and multi-agent platforms. National Champion (AIR 1), Smart India Hackathon 2023.', False),
]
SKILLS = [
    ('Computer Vision & Deep Learning',
     'Object Detection (YOLOv5/v8, RT-DETR), Multi-Object Tracking (ByteTrack, Kalman Filter), Re-Identification '
     '(OSNet-AIN, ResNet), ANPR & OCR (PaddleOCR PP-OCRv4), OpenCV, PyTorch, TensorFlow, Hugging Face, NLP'),
    ('Edge AI & Inference Optimization',
     'NVIDIA Jetson (Orin NX/Nano, Xavier), TensorRT (FP16/INT8), CUDA, ONNX Runtime, GStreamer (nvv4l2decoder), '
     'Hardware-Accelerated Video Decoding, Model Quantization, Raspberry Pi, Rockchip'),
    ('Generative AI & Agents',
     'Retrieval-Augmented Generation (RAG), Hybrid Search (FAISS + BM25 + RRF), LangChain, Multi-Agent Orchestration, '
     'Google ADK, Model Context Protocol (MCP), Prompt Engineering, Knowledge Graphs, Vector Databases (FAISS, '
     'ChromaDB), Gemini, Mistral, Ollama'),
    ('Backend, Streaming & Systems',
     'Python, FastAPI, Flask, Django/DRF, AsyncIO, asyncpg, REST APIs, Microservices, Event-Driven Architecture, '
     'Server-Sent Events, WebSockets (Socket.IO), RTSP, ONVIF, MediaMTX, Multithreading & Concurrency'),
    ('MLOps, Cloud & Data',
     'Docker, Kubernetes, CI/CD, Git, Linux, systemd, AWS, Microsoft Azure, GCP (Vertex AI), PostgreSQL, Redis, '
     'MongoDB, MySQL, RBAC, Automated Testing'),
]
EXPERIENCE = {
    'title': 'Software Engineer — AI/ML',
    'org': 'Arya Omnitalk Wireless Solutions Pvt. Ltd. (Arvind Group), Pune',
    'dates': 'Aug 2025 – Present',
    'groups': [
        ('VIDES — Edge Traffic Enforcement & ATCC Network',
         'NVIDIA Jetson Orin, TensorRT, GStreamer, YOLOv8, RT-DETR, PaddleOCR', [
            ('Architected the multi-model edge pipeline',
             'ran 7 models (6 TensorRT FP16 engines + PP-OCRv4) concurrently on one Jetson to deliver 14 detection '
             'types — ANPR, helmet, triple riding, seatbelt, speed, wrong-way, stopped vehicle, accident, pedestrian, '
             'animal and pothole — at 50,000+ events/day and 95% accuracy.'),
            ('Removed the CPU bottleneck',
             'built GPU-direct ingestion with GStreamer and nvv4l2decoder plus a tee-based H.264 passthrough (no '
             're-encode on the encoder-less Orin Nano), sustaining sub-40 ms frame processing across 6 concurrent '
             '1080p RTSP streams.'),
            ('Designed a fan-out/fan-in decision layer',
             'parallel ANPR, helmet and seatbelt worker pools on bounded queues, fused per vehicle by a detection '
             'finalizer with a 6 s timeout, so no single slow model can stall a record.'),
            ('Automated highway toll auditing',
             'built the ANPR path — YOLO plate localization, CLAHE preprocessing, Laplacian blur penalties and 2-read '
             'OCR consensus — logging every vehicle passage with evidence and eliminating manual reporting.'),
            ('Delivered sub-150 ms operator alerting',
             'decoupled inference from the UI with an async DB writer and an SSE → Socket.IO relay (exponential-backoff '
             'reconnect, rolling per-camera cache), with human-in-the-loop verification of every violation.'),
        ]),
        ('TMCS — Highway Incident Detection (NHAI ATMS 2023)',
         'YOLOv8, RT-DETR, ByteTrack, FastAPI, PostgreSQL, ONVIF', [
            ('Built the detection and rule engine',
             'dual-model detection (YOLOv8 + RT-DETR) with ByteTrack and a dt-aware Kalman filter across 7 incident '
             'rules and 11 object classes; 1.5 ms p50 tracking-and-rules latency (10.3 ms at 80 objects) against a '
             'p95 ≤ 45 ms inference target.'),
            ('Cut false alarms at the source',
             'rider-aware occupant tagging reduced false pedestrian alarms by 95%+; a night-mode glare guard (EMA luma '
             '+ HSV filtering) and PTZ-preset-aware analytics prevent false events at night and during camera movement.'),
            ('Hardened the device and data layers',
             'ONVIF circuit breaker rejects dead cameras in 0.1 ms (vs 10–30 s timeouts); preset sync cut from '
             '2,500 ms to under 10 ms (−99.6%); TTL caching cut analytics SQL load by 90%+; deterministic shutdown in '
             'under 0.5 s.'),
            ('Made evidence court-ready',
             'write-once evidence with SHA-256 integrity and full model/rule/config version traceability; RBAC with '
             '36 permissions across 5 role tiers; 298+ automated unit, integration and fault-injection tests.'),
        ]),
        ('Vehicle Re-Identification & Forensic Matching', 'PyTorch, YOLOv5, OSNet-AIN, FAISS IVF, FastAPI, Docker', [
            ('Owned the forensic search service',
             'designed a stateless, database-free re-identification microservice using 512-dimensional OSNet-AIN '
             'embeddings and FAISS IVF indexing — sub-100 ms search across 150,000+ daily forensic queries, 30× '
             'faster retrieval.'),
            ('Ran production operations',
             'CI/CD, heartbeat monitoring and automated recovery kept edge nodes at 99.9% uptime; worked across '
             'hardware, backend and operations teams from pilot to production.'),
        ]),
    ],
}
EARLIER = [
    ('AI Intern, IBM India (Jun – Aug 2023)',
     'built transformer-based NLP text classifiers reaching 90% accuracy on production datasets.'),
    ('AI Intern, MathWorks (May – Sep 2023)',
     'developed deep learning and image-processing solutions in MATLAB for computer vision use cases.'),
    ('Data Analytics Trainee, AICTE · VOIS for Tech · Vodafone Idea Foundation (Oct – Dec 2024)',
     'applied LLMs to agriculture and science analytics pipelines.'),
]
PROJECTS = [
    ('CivicMind — Smart City Decision Intelligence', 'Gemini 2.5, Vertex AI, FastAPI, Next.js 14, Docker', '2026',
     ('github.com/kulkarnishub377/CivicMind', 'https://github.com/kulkarnishub377/CivicMind'),
     ['Multi-agent orchestration platform (4 coordinated agents) with a digital-twin simulator and an Explainable AI '
      'layer for transparent, risk-based policy recommendations.']),
    ('OmniSight — Multi-Modal Incident Intelligence', 'FastAPI, Agentic AI, RAG, Vector DB, Docker', '2026',
     ('github.com/kulkarnishub377/OmniSight', 'https://github.com/kulkarnishub377/OmniSight'),
     ['Agentic workflow engine that correlates high-velocity IoT, camera and audio signals in real time to validate '
      'anomalies and generate safety guardrails.']),
    ('DocuAI Studio v3.1 — Document AI + RAG Platform', 'FastAPI, LangChain, FAISS, Mistral, Ollama',
     'Mar 2026 – Present',
     ('github.com/kulkarnishub377/Document-AI---RAG-Pipeline', 'https://github.com/kulkarnishub377/Document-AI---RAG-Pipeline'),
     ['Locally hosted RAG platform (40+ API endpoints) for PDFs, images and web URLs with sub-2 s answers and zero '
      'external data exposure.',
      'Hybrid retrieval fusing FAISS dense search with BM25 via Reciprocal Rank Fusion to reduce hallucinations; '
      'knowledge-graph entity extraction and complexity-based routing between local (Mistral 7B) and cloud LLMs.']),
    ('JalTantra — Smart Irrigation & AgTech Platform', 'Python, IoT, Computer Vision, ML, GenAI', 'Dec 2024 – May 2025',
     ('shubhamkulkarni.me/JalTantra', 'https://kulkarnishub377.github.io/JalTantra/'),
     ['IoT irrigation with predictive ML and CV crop-disease detection, improving water efficiency by 30%; '
      'multilingual (Hindi, Marathi, English) advisory chatbot. University Rank 2, SPPU Startup Olympiad 2025.']),
    ('Alumni Management Portal — Officially Adopted by the College', 'Django DRF, PostgreSQL, WebSockets',
     '2024 – 2025',
     ('github.com/kulkarnishub377/Alumni_Management_portal', 'https://github.com/kulkarnishub377/Alumni_Management_portal'),
     ['Role-based platform (19 data models, 50+ REST APIs, 4 dashboards); cut query latency from 3,200 ms to 12 ms '
      'with composite indexing and resolved JWT-refresh race conditions with a custom WebSocket subscriber queue.']),
]
EDUCATION = ('B.E., Electronics & Telecommunication — First Class', 'Savitribai Phule Pune University (SPPU)',
             'Dec 2021 – Mar 2025', 'Dr. Vithalrao Vikhe Patil College of Engineering, Ahilyanagar')
ACHIEVEMENTS = [
    ('AIR 1 — Smart India Hackathon 2023 (National Champion)',
     'team lead; built an AI e-waste classification and routing system, selected best nationally.'),
    ('Runner-Up (Global) — TIAA Global AI Hackathon', 'AI investment-intelligence platform with risk-based scoring.'),
    ('University Rank 2 — SPPU Startup Olympiad 2025', 'JalTantra precision-agriculture platform.'),
    ('Certifications',
     'Google Cloud Gen AI Academy APAC 2026 (Hack2skill) · Deploy Multi-Agent Architectures — Google (2026) · Engineer '
     'AI Agents with ADK — Google (2026) · Build AI Agents with Enterprise Databases — Google Cloud (2026) · '
     'Introduction to Machine Learning Concepts — Microsoft (2026) · Getting Started with AI on Jetson Nano — NVIDIA '
     'DLI (2025) · Career Essentials in Generative AI — Microsoft & LinkedIn · Deep Learning & Statistics Onramp — '
     'MathWorks'),
]

# ─────────────────────────── DOCX ───────────────────────────
NAVY, GREY, FONT = RGBColor(0x1F, 0x3A, 0x5F), RGBColor(0x44, 0x44, 0x44), 'Calibri'
doc = Document()
sec = doc.sections[0]
sec.page_width, sec.page_height = Cm(21.0), Cm(29.7)
sec.left_margin = sec.right_margin = Cm(1.6)
sec.top_margin, sec.bottom_margin = Cm(1.3), Cm(1.2)
TEXT_W = sec.page_width - sec.left_margin - sec.right_margin
for st in ('Normal', 'List Bullet'):
    s = doc.styles[st]; s.font.name = FONT; s.font.size = Pt(10)
    s.element.get_or_add_rPr().get_or_add_rFonts().set(qn('w:eastAsia'), FONT)
    s.paragraph_format.space_before = Pt(0); s.paragraph_format.line_spacing = 1.05
doc.styles['Normal'].paragraph_format.space_after = Pt(0)
doc.styles['List Bullet'].paragraph_format.space_after = Pt(1.5)
cp = doc.core_properties
cp.title, cp.author = 'Shubham Kulkarni — AI Engineer Resume', 'Shubham Kulkarni'
cp.keywords = ('AI Engineer, Machine Learning Engineer, Computer Vision, Edge AI, NVIDIA Jetson, TensorRT, YOLOv8, '
               'RT-DETR, ByteTrack, ANPR, PaddleOCR, RAG, LangChain, FAISS, Multi-Agent, FastAPI, PostgreSQL, Docker, '
               'Kubernetes, MLOps')


def run(p, text, bold=False, italic=False, size=None, color=None):
    r = p.add_run(text); r.bold, r.italic = bold, italic
    if size: r.font.size = Pt(size)
    if color: r.font.color.rgb = color


def link(p, text, url, size=None):
    rid = p.part.relate_to(url, 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink',
                           is_external=True)
    h = OxmlElement('w:hyperlink'); h.set(qn('r:id'), rid)
    r = OxmlElement('w:r'); rpr = OxmlElement('w:rPr')
    c = OxmlElement('w:color'); c.set(qn('w:val'), '1F3A5F'); rpr.append(c)
    if size:
        sz = OxmlElement('w:sz'); sz.set(qn('w:val'), str(int(size * 2))); rpr.append(sz)
    r.append(rpr); t = OxmlElement('w:t'); t.text = text; t.set(qn('xml:space'), 'preserve'); r.append(t)
    h.append(r); p._p.append(h)


def para(space_before=0, keep=False, align=None, tab=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.keep_with_next = keep
    if align is not None: p.alignment = align
    if tab: p.paragraph_format.tab_stops.add_tab_stop(TEXT_W, WD_TAB_ALIGNMENT.RIGHT)
    return p


def heading(text):
    p = para(8, keep=True); p.paragraph_format.space_after = Pt(3)
    run(p, text.upper(), bold=True, size=10.5, color=NAVY)
    ppr = p._p.get_or_add_pPr(); bdr = OxmlElement('w:pBdr'); bt = OxmlElement('w:bottom')
    for k, v in (('val', 'single'), ('sz', '8'), ('space', '1'), ('color', '1F3A5F')): bt.set(qn('w:' + k), v)
    bdr.append(bt)
    ppr.insert_element_before(bdr, 'w:shd', 'w:tabs', 'w:suppressAutoHyphens', 'w:kinsoku', 'w:wordWrap',
                              'w:overflowPunct', 'w:topLinePunct', 'w:autoSpaceDE', 'w:autoSpaceDN', 'w:bidi',
                              'w:adjustRightInd', 'w:snapToGrid', 'w:spacing', 'w:ind', 'w:contextualSpacing',
                              'w:mirrorIndents', 'w:suppressOverlap', 'w:jc', 'w:textDirection', 'w:textAlignment',
                              'w:textboxTightWrap', 'w:outlineLvl', 'w:divId', 'w:cnfStyle', 'w:rPr', 'w:sectPr',
                              'w:pPrChange')


def bullet(lead, text):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.keep_together = True
    if lead: run(p, lead + ': ', bold=True)
    run(p, text)


def dated(left_bold, left_rest, dates, rest_italic=False, space=3):
    p = para(space, keep=True, tab=True)
    run(p, left_bold, bold=True, size=10.5)
    run(p, '  |  ' + left_rest, italic=rest_italic, size=9.5 if rest_italic else 10.5, color=GREY if rest_italic else None)
    run(p, '\t' + dates, bold=True, size=10, color=NAVY)


p = para(align=WD_ALIGN_PARAGRAPH.CENTER); run(p, NAME, bold=True, size=20, color=NAVY)
p = para(align=WD_ALIGN_PARAGRAPH.CENTER); p.paragraph_format.space_after = Pt(2)
run(p, TITLE, bold=True, size=11, color=GREY)
for line in CONTACT:
    p = para(align=WD_ALIGN_PARAGRAPH.CENTER)
    for i, (t, u) in enumerate(line):
        if i: run(p, '  |  ', size=9.5)
        link(p, t, u, 9.5) if u else run(p, t, size=9.5)

heading('Professional Summary')
p = para(align=WD_ALIGN_PARAGRAPH.JUSTIFY)
for t, bo in SUMMARY: run(p, t, bold=bo)

heading('Core Competencies')
for label, items in SKILLS:
    p = para(); p.paragraph_format.space_after = Pt(1.5); run(p, label + ': ', bold=True); run(p, items)

heading('Professional Experience')
dated(EXPERIENCE['title'], EXPERIENCE['org'], EXPERIENCE['dates'])
for name, stack, items in EXPERIENCE['groups']:
    p = para(4, keep=True); p.paragraph_format.space_after = Pt(1)
    run(p, name, bold=True, color=NAVY); run(p, '  |  ' + stack, italic=True, size=9.5, color=GREY)
    for lead, text in items: bullet(lead, text)
p = para(4, keep=True); p.paragraph_format.space_after = Pt(1); run(p, 'Earlier Experience', bold=True, color=NAVY)
for lead, text in EARLIER: bullet(lead, text)

heading('Selected Projects')
for name, stack, dates, (lt, lu), items in PROJECTS:
    dated(name, stack, dates, rest_italic=True, space=4)
    p = para(keep=True); link(p, lt, lu, 9.5)
    for text in items: bullet(None, text)

heading('Education')
dated(EDUCATION[0], EDUCATION[1], EDUCATION[2])
p = para(); run(p, EDUCATION[3], italic=True, size=9.5, color=GREY)

heading('Achievements & Certifications')
for lead, text in ACHIEVEMENTS: bullet(lead, text)
for z in doc.settings.element.findall(qn('w:zoom')):
    z.set(qn('w:percent'), '100')
doc.save(DOCX_OUT)

# ─────────────────────────── HTML ───────────────────────────
e = html.escape
out = [f'<h1>{e(NAME)}</h1>', f'<p class="title">{e(TITLE)}</p>']
for line in CONTACT:
    out.append('<p class="contact">' + '  <span class="sep">|</span>  '.join(
        f'<a href="{e(u)}">{e(t)}</a>' if u else e(t) for t, u in line) + '</p>')


def h2(t): out.append(f'<h2>{e(t)}</h2>')
def li(lead, text): return f'<li>{f"<b>{e(lead)}:</b> " if lead else ""}{e(text)}</li>'
def row(lb, rest, dates, it=False):
    r = f'<span class="it">{e(rest)}</span>' if it else e(rest)
    return f'<p class="row"><span><b>{e(lb)}</b>  <span class="sep">|</span>  {r}</span><span class="date">{e(dates)}</span></p>'


h2('Professional Summary')
out.append('<p class="just">' + ''.join(f'<b>{e(t)}</b>' if bo else e(t) for t, bo in SUMMARY) + '</p>')
h2('Core Competencies')
out += [f'<p class="skill"><b>{e(l)}:</b> {e(i)}</p>' for l, i in SKILLS]
h2('Professional Experience')
out.append(row(EXPERIENCE['title'], EXPERIENCE['org'], EXPERIENCE['dates']))
for name, stack, items in EXPERIENCE['groups']:
    out.append(f'<p class="grp"><b>{e(name)}</b>  <span class="sep">|</span>  <span class="it">{e(stack)}</span></p>')
    out.append('<ul>' + ''.join(li(a, b) for a, b in items) + '</ul>')
out.append('<p class="grp"><b>Earlier Experience</b></p><ul>' + ''.join(li(a, b) for a, b in EARLIER) + '</ul>')
h2('Selected Projects')
for name, stack, dates, (lt, lu), items in PROJECTS:
    out.append('<div class="proj">' + row(name, stack, dates, it=True) +
               f'<p class="plink"><a href="{e(lu)}">{e(lt)}</a></p><ul>' + ''.join(li(None, t) for t in items) +
               '</ul></div>')
h2('Education')
out.append(row(*EDUCATION[:3]) + f'<p class="it small">{e(EDUCATION[3])}</p>')
h2('Achievements & Certifications')
out.append('<ul>' + ''.join(li(a, b) for a, b in ACHIEVEMENTS) + '</ul>')

CSS = """
@page { size: A4; margin: 13mm 16mm 12mm; }
* { margin: 0; padding: 0; box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: Calibri, Carlito, 'Segoe UI', Arial, sans-serif; font-size: 10pt; line-height: 1.24; color: #111; }
a { color: #1F3A5F; text-decoration: none; }
h1 { font-size: 20pt; color: #1F3A5F; text-align: center; letter-spacing: .02em; line-height: 1.1; }
.title { text-align: center; font-weight: 700; font-size: 11pt; color: #444; margin: 2pt 0 2pt; }
.contact { text-align: center; font-size: 9.5pt; }
.sep { color: #888; }
h2 { font-size: 10.5pt; color: #1F3A5F; text-transform: uppercase; border-bottom: 1px solid #1F3A5F;
     padding-bottom: 1.5pt; margin: 8pt 0 3pt; letter-spacing: .03em; break-after: avoid; }
.just { text-align: justify; }
.skill { margin-bottom: 1.5pt; }
.row { display: flex; justify-content: space-between; align-items: baseline; gap: 12pt; margin-top: 3pt; break-after: avoid; }
.row > span:first-child b { font-size: 10.5pt; }
.date { font-weight: 700; color: #1F3A5F; white-space: nowrap; }
.it { font-style: italic; color: #444; font-size: 9.5pt; }
.small { font-size: 9.5pt; }
.grp { margin: 4pt 0 1pt; break-after: avoid; }
.grp b { color: #1F3A5F; }
.proj { break-inside: avoid; margin-top: 1pt; }
.plink { font-size: 9.5pt; }
ul { padding-left: 13pt; margin-top: 1pt; }
li { margin-bottom: 1.6pt; break-inside: avoid; }
li::marker { color: #1F3A5F; }
"""
with open(HTML_OUT, 'w', encoding='utf-8') as f:
    f.write(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Shubham Kulkarni — AI Engineer Resume'
            f'</title><meta name="author" content="Shubham Kulkarni"><style>{CSS}</style></head><body>'
            + '\n'.join(out) + '</body></html>')
print('ok')
