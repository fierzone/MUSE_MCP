// --------------------------------------------------------------------------
// ⚡ MUSE AI & REMOTION VIDEO STUDIO — REACT APP COMPONENT
// --------------------------------------------------------------------------

const { useState, useEffect, useRef } = React;

// 1. Header Navbar Component
function HeaderNav({ status }) {
  return (
    <header>
      <div className="brand">
        <div className="brand-icon"><i className="ri-video-sparkline-fill"></i></div>
        <div className="brand-text">MUSE <span>STUDIO WEB</span></div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div className="status-badge">
          <div className={`status-dot ${status.loggedIn ? '' : 'offline'}`}></div>
          <span>{status.loggedIn ? 'Chrome Muse Logged In' : 'Chưa kết nối / Chưa Login'}</span>
        </div>
      </div>
    </header>
  );
}

// 2. Remotion AI Video Studio Component
function VideoStudioTab() {
  const [topic, setTopic] = useState('DockerExplainer');
  const [channelName, setChannelName] = useState('FierZone');
  const [voice, setVoice] = useState('vi-VN-NamMinhNeural');
  const [rate, setRate] = useState('+10%');
  const [prompt, setPrompt] = useState('');
  const [scriptJsonText, setScriptJsonText] = useState('');
  const [generatingScript, setGeneratingScript] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [logs, setLogs] = useState('🚀 Sẵn sàng. Nhập chủ đề bất kỳ, bấm "AI Gợi Ý Kịch Bản & Code" để tạo hoặc tự dán kịch bản JSON...');
  const [videoSrc, setVideoSrc] = useState('/v1/downloads/DockerExplainer.mp4');

  // AI Script Generation Handler
  const handleGenerateScript = async () => {
    if (!prompt.trim()) {
      alert('Vui lòng nhập Prompt chủ đề video (ví dụ: "Giải thích Kubernetes trong 6 cảnh ngắn")');
      return;
    }

    setGeneratingScript(true);
    setLogs(`🤖 Muse AI đang biên soạn kịch bản 6 cảnh & Remotion Code cho chủ đề: "${prompt}"...`);

    try {
      const res = await fetch('/v1/ai-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, topicKey: topic !== 'DockerExplainer' && topic !== 'DemoTopic' ? topic : undefined })
      });
      const data = await res.json();

      if (data.ok && data.script) {
        setScriptJsonText(JSON.stringify(data.script, null, 2));
        if (data.script.topicKey) setTopic(data.script.topicKey);
        setLogs(prev => prev + `\n\n✅ ĐÃ TẠO XONG KỊCH BẢN CHỦ ĐỀ "${data.script.topicKey || topic}"!\n\nBạn có thể chỉnh sửa trực tiếp nội dung lời thoại bên dưới trước khi bấm Render.`);
      } else {
        setLogs(prev => prev + `\n\n❌ LỖI TẠO KỊCH BẢN: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      setLogs(prev => prev + `\n\n❌ LỖI KẾT NỐI: ${err.message}`);
    } finally {
      setGeneratingScript(false);
    }
  };

  // Video Render Handler
  const handleGenVideo = async () => {
    setRendering(true);
    let customScriptObj = null;

    if (scriptJsonText.trim()) {
      try {
        customScriptObj = JSON.parse(scriptJsonText.trim());
      } catch (err) {
        alert('Cú pháp JSON kịch bản không hợp lệ. Vui lòng kiểm tra lại!');
        setRendering(false);
        return;
      }
    }

    const currentTopic = customScriptObj?.topicKey || topic;
    setLogs(`🎬 Khởi tạo Render Video MP4 cho chủ đề: "${currentTopic}"\n🏷️ Thương hiệu: "${channelName}"\n🎙️ Voice: ${voice} (${rate})\n⌛ Vui lòng đợi trong giây lát...`);

    try {
      const res = await fetch('/v1/gen-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: currentTopic,
          prompt,
          channelName,
          voice,
          rate,
          customScript: customScriptObj
        })
      });
      const data = await res.json();

      if (data.ok) {
        setLogs(prev => prev + `\n\n🎉 RENDER THÀNH CÔNG VỚI CHỦ ĐỀ MỚI!\n📁 File xuất tại: ${data.outputPath}\n⏱️ Thời gian: ${data.elapsedSec || 'N/A'}s`);
        setVideoSrc(`/v1/downloads/${currentTopic}.mp4?t=${Date.now()}`);
      } else {
        setLogs(prev => prev + `\n\n❌ LỖI RENDER: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      setLogs(prev => prev + `\n\n❌ LỖI KẾT NỐI: ${err.message}`);
    } finally {
      setRendering(false);
    }
  };

  return (
    <div className="grid-3">
      {/* Left Controls Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="ri-magic-line"></i> Tạo & Chỉnh Sửa Kịch Bản Theo Ý Muốn</div>
        </div>

        <div className="form-group">
          <label><i className="ri-openai-fill"></i> 1. Nhập Ý Tưởng / Chủ Đề Video Bất Kỳ</label>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Ví dụ: Giải thích khái niệm Kubernetes, 3 mẹo Clean Code, Lập trình Python FastAPI..."
            rows={3}
          ></textarea>
        </div>

        <button className="btn btn-secondary" onClick={handleGenerateScript} disabled={generatingScript}>
          {generatingScript ? <><i className="ri-loader-4-line ri-spin"></i> Đang Soạn Kịch Bản AI...</> : <><i className="ri-sparkling-fill"></i> 🤖 AI Gợi Ý Kịch Bản & Remotion Code</>}
        </button>

        <div className="form-group" style={{ marginTop: '12px' }}>
          <label><i className="ri-edit-code-line"></i> 2. Kịch Bản JSON 6 Cảnh (Xem & Sửa Tự Do)</label>
          <textarea
            value={scriptJsonText}
            onChange={e => setScriptJsonText(e.target.value)}
            placeholder='Bấm nút trên để Muse AI tự sinh kịch bản JSON, hoặc tự dán kịch bản của bạn vào đây...'
            rows={10}
            style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.5' }}
          ></textarea>
        </div>

        <div className="form-group">
          <label><i className="ri-flag-2-line"></i> Thương hiệu Kênh (Brand Header)</label>
          <input type="text" value={channelName} onChange={e => setChannelName(e.target.value)} placeholder="Ví dụ: FierZone, Cường IT..." />
        </div>

        <div className="form-group">
          <label><i className="ri-mic-line"></i> Giọng đọc AI (Edge TTS)</label>
          <select value={voice} onChange={e => setVoice(e.target.value)}>
            <option value="vi-VN-NamMinhNeural">vi-VN-NamMinhNeural (Nam - Trầm ấm)</option>
            <option value="vi-VN-HoaiMyNeural">vi-VN-HoaiMyNeural (Nữ - Truyền cảm)</option>
            <option value="en-US-ChristopherNeural">en-US-ChristopherNeural (Nam tiếng Anh)</option>
            <option value="en-US-JennyNeural">en-US-JennyNeural (Nữ tiếng Anh)</option>
          </select>
        </div>

        <div className="form-group">
          <label><i className="ri-speed-line"></i> Tốc độ đọc (Rate)</label>
          <input type="text" value={rate} onChange={e => setRate(e.target.value)} placeholder="+10%, +15%, +0%" />
        </div>

        <button className="btn btn-primary" onClick={handleGenVideo} disabled={rendering}>
          {rendering ? <><i className="ri-loader-4-line ri-spin"></i> Đang Tạo Voice & Render Video MP4...</> : <><i className="ri-movie-2-line"></i> 🎥 Biên Dịch & Render Video MP4 Theo Ý Muốn</>}
        </button>
      </div>

      {/* Right Column: Console & Player Preview */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="grid-2">
          {/* Logs Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><i className="ri-terminal-box-line"></i> Tiến trình Render & Logs</div>
            </div>
            <div className="console-box">{logs}</div>
          </div>

          {/* Video Preview */}
          <div className="card" style={{ alignItems: 'center' }}>
            <div className="card-header" style={{ width: '100%' }}>
              <div className="card-title"><i className="ri-play-circle-line"></i> Trình Xem Trước Video MP4</div>
            </div>
            <div className="video-preview-box">
              <video key={videoSrc} controls poster="/assets/demo-preview.png">
                <source src={videoSrc} type="video/mp4" />
                Trình duyệt không hỗ trợ video MP4.
              </video>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Muse AI Chat Studio Component
function ChatStudioTab() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: '👋 Xin chào! Tôi là Meta Muse AI (Hatch). Bạn muốn sáng tạo nội dung, kịch bản hay tạo ảnh/video gì hôm nay?' }
  ]);
  const [prompt, setPrompt] = useState('');
  const [file, setFile] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userText = prompt.trim() + (file.trim() ? `\n📎 [File: ${file.trim()}]` : '');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'muse-spark-1.3',
          messages: [{ role: 'user', content: userText }],
          files: file.trim() ? [file.trim()] : undefined,
          stream: false
        })
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || JSON.stringify(data);
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: '❌ Lỗi kết nối: ' + err.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title"><i className="ri-chat-3-line"></i> Giao diện Chat & Ra Lệnh cho Meta Muse AI</div>
      </div>

      <div className="chat-history">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role}`}>{m.text}</div>
        ))}
        {loading && <div className="chat-msg assistant"><i className="ri-loader-4-line ri-spin"></i> Muse AI đang trả lời...</div>}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Nhập câu hỏi hoặc câu lệnh cho Muse AI..." rows="3"></textarea>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <input type="text" value={file} onChange={e => setFile(e.target.value)} placeholder="Đường dẫn file đính kèm (ảnh/video)..." style={{ width: '360px' }} />
          <button className="btn btn-primary" onClick={handleSend} disabled={loading}>
            <i className="ri-send-plane-fill"></i> Gửi Prompt tới Muse AI
          </button>
        </div>
      </div>
    </div>
  );
}

// 4. Media Manager & Downloads Component
function MediaManagerTab() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDownloads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/v1/downloads');
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title"><i className="ri-folder-download-line"></i> Danh Sách Video & File Đã Sinh (`./downloads`)</div>
        <button className="btn btn-secondary" onClick={fetchDownloads}><i className="ri-refresh-line"></i> Làm mới danh sách</button>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-muted)' }}>Đang tải danh sách...</div>
      ) : files.length === 0 ? (
        <div style={{ color: 'var(--text-muted)' }}>Chưa có file MP4 nào trong thư mục ./downloads</div>
      ) : (
        <div className="media-grid">
          {files.map((f, i) => (
            <div key={i} className="media-card">
              <div style={{ background: '#000', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <video src={`/v1/downloads/${encodeURIComponent(f.name)}`} style={{ maxHeight: '100%', maxWidth: '100%' }} controls></video>
              </div>
              <div className="media-card-body">
                <div className="media-card-title">🎬 {f.name}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Kích thước: {(f.size / (1024*1024)).toFixed(2)} MB</div>
                <a href={`/v1/downloads/${encodeURIComponent(f.name)}`} download class="btn btn-secondary" style={{ marginTop: '6px' }}>
                  <i className="ri-download-cloud-line"></i> Tải Về File MP4
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 5. System Inspector Component
function SystemInspectorTab({ status }) {
  return (
    <div className="grid-2">
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="ri-server-line"></i> Thông tin Server & API Endpoints</div>
        </div>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
          Server đang chạy tại <strong>http://127.0.0.1:8787</strong>.<br/>
          Tích hợp qua MCP Client (Claude Desktop, Cursor) hoặc OpenAI API:
        </p>

        <div className="console-box" style={{ minHeight: '140px' }}>
# OpenAI SDK Base URL:
http://127.0.0.1:8787/v1

# Models:
muse-spark-1.3, muse

# Health Check:
http://127.0.0.1:8787/health
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="ri-shield-check-line"></i> Trạng thái Chrome Driver</div>
        </div>
        <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
          <p><strong>Browser Running:</strong> {status.browserRunning ? '🟢 True' : '🔴 False'}</p>
          <p><strong>Logged In:</strong> {status.loggedIn ? '🟢 True' : '🔴 False'}</p>
          <p><strong>Composer Ready:</strong> {status.composerReady ? '🟢 True' : '🔴 False'}</p>
        </div>
      </div>
    </div>
  );
}

// Main Root Application
function App() {
  const [tab, setTab] = useState('video');
  const [status, setStatus] = useState({ browserRunning: false, loggedIn: false, composerReady: false });

  const fetchStatus = async () => {
    try {
      const res = await fetch('/health');
      const data = await res.json();
      setStatus(data);
    } catch {}
  };

  useEffect(() => {
    fetchStatus();
    const timer = setInterval(fetchStatus, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <HeaderNav status={status} />

      <div className="main-container">
        <div className="nav-tabs">
          <button className={`tab-btn ${tab === 'video' ? 'active' : ''}`} onClick={() => setTab('video')}>
            <i className="ri-clapperboard-fill"></i> Remotion Video Studio
          </button>
          <button className={`tab-btn ${tab === 'chat' ? 'active' : ''}`} onClick={() => setTab('chat')}>
            <i className="ri-chat-voice-fill"></i> Muse AI Prompt Chat
          </button>
          <button className={`tab-btn ${tab === 'media' ? 'active' : ''}`} onClick={() => setTab('media')}>
            <i className="ri-folder-video-fill"></i> Media & Downloads
          </button>
          <button className={`tab-btn ${tab === 'system' ? 'active' : ''}`} onClick={() => setTab('system')}>
            <i className="ri-settings-4-fill"></i> System & API Info
          </button>
        </div>

        {tab === 'video' && <VideoStudioTab />}
        {tab === 'chat' && <ChatStudioTab />}
        {tab === 'media' && <MediaManagerTab />}
        {tab === 'system' && <SystemInspectorTab status={status} />}
      </div>

      <footer>
        <p>🚀 Muse AI & Remotion Video Studio Dashboard • React Component Architecture</p>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
