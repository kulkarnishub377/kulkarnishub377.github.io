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
TITLE = 'Software Engineer, AI/ML  |  Computer Vision  ·  Edge AI  ·  Real-time Systems  ·  RAG'
CONTACT = [
    [('Pune, Maharashtra, India', None), ('+91 83080 03684', None),
     ('21shubhamkulkarni@gmail.com', 'mailto:21shubhamkulkarni@gmail.com')],
    [('linkedin.com/in/shubhkulk21', 'https://www.linkedin.com/in/shubhkulk21/'),
     ('github.com/kulkarnishub377', 'https://github.com/kulkarnishub377'),
     ('shubhamkulkarni.me', 'https://shubhamkulkarni.me')],
]
SUMMARY = [
    ('Software engineer who builds and runs production computer vision for national highways. Developer of ', False),
    ('VIDS', True),
    (', an edge enforcement and incident system (7 models per node, 16 violation and incident types plus ANPR and speed '
     'on every vehicle; 50,000+ unique vehicles a day across a ~100 km corridor at 90%+ ANPR accuracy), which I scaled '
     'from a Jetson Orin Nano to 12 cameras on one RTX 5060 Ti. Core engineer on ', False),
    ('TMCS', True),
    (', NHAI ATMS-aligned incident detection running 26 camera streams at once. I own work end to end, from model '
     'training and TensorRT to tracking, backend services, testing and on-site deployment. I also build RAG and agent '
     'applications. National Champion (AIR 1), Smart India Hackathon 2023.', False),
]
SKILLS = [
    ('Core',
     'Machine Learning, Deep Learning, Computer Vision, Object Detection, Object Tracking, Image Processing, OCR, '
     'Model Optimization, Model Deployment, Edge AI, Real-time Video Analytics, LLMs, RAG, Data Structures & Algorithms'),
    ('Languages & Frameworks',
     'Python, SQL, JavaScript, PyTorch, TensorFlow, OpenCV, scikit-learn, NumPy, Pandas, Hugging Face, LangChain, '
     'LangGraph, FastAPI, Flask, Django REST Framework'),
    ('Computer Vision',
     'YOLO (v5/v8/11/26), RT-DETR, ByteTrack, Kalman Filter, ANPR, PaddleOCR, Re-Identification (OSNet, ResNet), '
     'Data Annotation, Model Training'),
    ('Inference & Deployment',
     'TensorRT, ONNX, CUDA, NVIDIA Jetson, GPU Servers, GStreamer, Docker, Linux, systemd, Git, REST APIs, '
     'Microservices, Multithreading, asyncio'),
    ('Data & Streaming',
     'PostgreSQL, Redis, SQLite, FAISS, Qdrant, Vector Search, RTSP, ONVIF, Server-Sent Events, WebSockets (Socket.IO), '
     'Google Cloud (Vertex AI, BigQuery), pytest, Unit Testing'),
]
EXPERIENCE = {
    'title': 'Software Engineer, AI/ML',
    'org': 'Arya Omnitalk Wireless Solutions Pvt. Ltd. (Arvind Group), Pune',
    'dates': 'Aug 2025 – Present',
    'groups': [
        ('VIDS (VIDES) — Edge Enforcement & Incident Detection',
         'Jetson Orin, RTX 5060 Ti, TensorRT, GStreamer, YOLO, RT-DETR, PaddleOCR, PostgreSQL', [
            ('Built the multi-model pipeline',
             '7 models (6 TensorRT FP16 engines + PP-OCRv4) on one node, covering ANPR and speed for every vehicle plus '
             '16 violation and incident types (helmet, triple riding, seatbelt, overspeed, wrong lane, wrong way, '
             'banned vehicle, stopped vehicle, illegal parking, accident, queue, pedestrian, animal, debris, pothole, '
             'low visibility). Logs 50,000+ unique vehicles a day across a ~100 km corridor at 90%+ ANPR accuracy.'),
            ('Scaled it to 12 cameras on one GPU',
             'took VIDS from a Jetson Orin Nano (3 lane + 1 overview camera, 126 ms median detect-and-track) to 12 '
             'cameras with every detector on, on one RTX 5060 Ti. Profiling showed ~90% of frame time spent waiting for '
             'the GPU lock, so I replaced per-camera RT-DETR engines with a shared engine pool with stale-result '
             'dropping and hung-engine recovery.'),
            ('Fixed silent misses in the field',
             'traced a missed animal-on-road alert to tracker score fusion and small objects at a 640 px input; '
             'shipped a same-day hotfix, then ported a tracker that keeps weak new tracks, tiled wide areas, and added '
             'per-minute counters for every dropped detection.'),
            ('Built the ANPR and decision path',
             'plate detector, PP-OCRv4, blur penalty and 2-read consensus; helmet and seatbelt pipelines in parallel '
             'worker pools on bounded queues, joined per vehicle by a finalizer with a timeout.'),
            ('Delivered events and evidence',
             'async DB writer, SSE to Socket.IO dashboard alerts in under 150 ms, an ATMS sync service that sends every '
             'finished detection to the customer, and video-clip evidence encoded off the camera threads.'),
        ]),
        ('TMCS — Highway Incident Detection (NHAI ATMS 2023)',
         'FastAPI, asyncpg, PostgreSQL, YOLO, RT-DETR, ByteTrack, ONVIF', [
            ('Built the detection and rule engine',
             'two models (YOLO for vehicles, RT-DETR for people, animals and debris), time-based tracking and 7 incident '
             'rules over 11 object classes, running 26 camera streams at once on one GPU server.'),
            ('Cut false alarms',
             'linked riders to their vehicles so they never raise pedestrian alarms; added a night glare filter and '
             'PTZ-aware analytics that pause and reload zones whenever a camera moves.'),
            ('Made it reliable and auditable',
             'write-once evidence with SHA-256 and model/rule version tracing; ONVIF circuit breaker for dead '
             'cameras; preset loading cut from 2,500 ms to under 10 ms with one batched upsert; 360 automated tests.'),
        ]),
        ('Vehicle Re-Identification & Forensic Search', 'PyTorch, YOLO, OSNet, FAISS IVF, FastAPI, Docker', [
            ('Built the search service',
             'stateless re-ID service with 512-d OSNet embeddings and FAISS IVF indexing: 30× faster retrieval, under '
             '100 ms per search, 150,000+ queries a day.'),
        ]),
        ('Engineering practice', 'pytest, systemd, Linux', [
            ('Testing and deployment',
             'wrote and maintain 2,400+ automated tests across VIDS and TMCS; deploy and support systems on Jetson '
             'devices and Linux GPU servers at customer sites.'),
        ]),
    ],
}
EARLIER = [
    ('AI Intern, IBM India (Jun – Aug 2023)',
     'fine-tuned BERT, DistilBERT and RoBERTa classifiers to detect stress and distress in text, reaching 90% accuracy.'),
    ('Computer Vision Intern, MathWorks (May – Sep 2023)',
     'built CNN image-classification and preprocessing workflows in MATLAB for visual inspection.'),
    ('Data Analytics & GenAI Trainee, AICTE · VOIS for Tech (Oct – Dec 2024)',
     'Pandas pipelines and LLM-generated irrigation advice from farm sensor data.'),
]
PROJECTS = [
    ('Data Annotation Studio — open source', 'Python, Flask, Ultralytics, SQLite, PyInstaller', '2026',
     ('github.com/kulkarnishub377/Data_Annotation_Tool', 'https://github.com/kulkarnishub377/Data_Annotation_Tool'),
     ['Offline labelling tool: YOLO auto-labelling (v8/11/26), box and polygon labels, 7-check dataset health report, '
      'YOLO/COCO export and in-browser training. Auto-labels 100,000 images in 30 minutes on a Jetson Orin NX; 74 tests.']),
    ('MHADA Pune Explorer — live product', 'JavaScript, Cloudflare Workers, Schema.org', '2026',
     ('mhadaexplore.app', 'https://mhadaexplore.app'),
     ['Independent English/Marathi guide to the MHADA Pune 2026 housing lottery: scheme finder, search across 2.68 lakh '
      'draft-list applications, EMI calculator. 141K Google clicks and 1.56M impressions in 3 months (avg. position '
      '4.9); 108K visits in the last 30 days.']),
    ('DocuAI Studio v3.1 — Document AI + RAG', 'FastAPI, LangChain, FAISS, BM25, PaddleOCR, Ollama', '2026',
     ('github.com/kulkarnishub377/Document-AI---RAG-Pipeline', 'https://github.com/kulkarnishub377/Document-AI---RAG-Pipeline'),
     ['Local RAG app with cited answers: hybrid retrieval (FAISS + BM25 + RRF) with cross-encoder reranking, OCR for '
      'scanned pages, knowledge-graph view; 48 API endpoints; runs Mistral locally through Ollama.']),
    ('OmniSight — Multi-Modal Incident Intelligence', 'FastAPI, PostgreSQL, Qdrant, Redis, Prometheus', '2026',
     ('github.com/kulkarnishub377/OmniSight', 'https://github.com/kulkarnishub377/OmniSight'),
     ['Event-driven platform that takes camera, IoT, audio and procedure-document signals and runs an agent that '
      'investigates each event with vector memory; 29 API endpoints.']),
    ('Alumni Management Portal — adopted by the college', 'Django DRF, PostgreSQL, JWT', '2024 – 2025',
     ('github.com/kulkarnishub377/Alumni_Management_portal', 'https://github.com/kulkarnishub377/Alumni_Management_portal'),
     ['Role-based platform for 500+ alumni (19 models, 50+ REST APIs, 4 dashboards); query time cut from 3,200 ms '
      'to 12 ms with composite indexes.']),
]
EDUCATION = ('B.E., Electronics & Telecommunication — First Class', 'Savitribai Phule Pune University (SPPU)',
             'Dec 2021 – Mar 2025', 'Dr. Vithalrao Vikhe Patil College of Engineering, Ahilyanagar')
ACHIEVEMENTS = [
    ('AIR 1 — Smart India Hackathon 2023 (National Champion)',
     'team lead; AI e-waste sorting and collection system.'),
    ('Runner-Up (Global) — TIAA Global AI Hackathon', 'AI tool for investment risk scoring.'),
    ('University Rank 2 — SPPU Startup Olympiad 2025', 'JalTantra IoT + ML smart irrigation.'),
    ('Certifications',
     'Google Cloud Gen AI Academy APAC 2026 (Hack2skill) · Deploy Multi-Agent Architectures — Google (2026) · Engineer '
     'AI Agents with ADK — Google (2026) · Build AI Agents with Enterprise Databases — Google Cloud (2026) · Getting '
     'Started with AI on Jetson Nano — NVIDIA DLI (2025)'),
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
cp.title, cp.author = 'Shubham Kulkarni — Software Engineer, AI/ML Resume', 'Shubham Kulkarni'
cp.keywords = ('Software Engineer AI/ML, Machine Learning Engineer, Computer Vision, Edge AI, NVIDIA Jetson, TensorRT, YOLO, RT-DETR, ByteTrack, ANPR, PaddleOCR, RAG, LangChain, FAISS, FastAPI, PostgreSQL, Docker')


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

heading('Skills')
for label, items in SKILLS:
    p = para(); p.paragraph_format.space_after = Pt(1.5); run(p, label + ': ', bold=True); run(p, items)

heading('Work Experience')
dated(EXPERIENCE['title'], EXPERIENCE['org'], EXPERIENCE['dates'])
for name, stack, items in EXPERIENCE['groups']:
    p = para(4, keep=True); p.paragraph_format.space_after = Pt(1)
    run(p, name, bold=True, color=NAVY); run(p, '  |  ' + stack, italic=True, size=9.5, color=GREY)
    for lead, text in items: bullet(lead, text)

heading('Projects')
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
h2('Skills')
out += [f'<p class="skill"><b>{e(l)}:</b> {e(i)}</p>' for l, i in SKILLS]
h2('Work Experience')
out.append(row(EXPERIENCE['title'], EXPERIENCE['org'], EXPERIENCE['dates']))
for name, stack, items in EXPERIENCE['groups']:
    out.append(f'<p class="grp"><b>{e(name)}</b>  <span class="sep">|</span>  <span class="it">{e(stack)}</span></p>')
    out.append('<ul>' + ''.join(li(a, b) for a, b in items) + '</ul>')
h2('Projects')
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
    f.write(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Shubham Kulkarni — Software Engineer, AI/ML Resume'
            f'</title><meta name="author" content="Shubham Kulkarni"><style>{CSS}</style></head><body>'
            + '\n'.join(out) + '</body></html>')
print('ok')
