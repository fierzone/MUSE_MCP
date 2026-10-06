// --------------------------------------------------------------------------
// ⚡ FZ STUDIO WEB — MONITORING DASHBOARD WEB & CHAT
// --------------------------------------------------------------------------

const { useState, useEffect, useRef } = React;

// 1. Toast Notification Component
function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast-card toast-${t.type}`}>
          <div className="toast-icon">
            {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}
          </div>
          <div className="toast-body">
            <div className="toast-title">{t.title}</div>
            {t.message && <div className="toast-msg">{t.message}</div>}
          </div>
          <span className="toast-close" onClick={() => removeToast(t.id)}>✕</span>
        </div>
      ))}
    </div>
  );
}

// 2. Header Navbar Component
function HeaderNav({ status }) {
  return (
    <header>
      <div className="brand">
        <img src="/logo.png" alt="FierZone Mascot" className="brand-logo-img" />
        <div className="brand-text">FZ <span>STUDIO WEB</span></div>
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

// 3. Remotion Video Studio Monitor Component (Display & Preview Only)
function VideoStudioTab() {
  const [logs, setLogs] = useState('🚀 Sẵn sàng. Tiến trình & Log Output từ Antigravity AI Agent sẽ hiển thị tại đây...');
  const [videoSrc, setVideoSrc] = useState(null); // Starts as null so placeholder displays initially

  return (
    <div className="grid-2">
      {/* Progress & Console Log Output */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="ri-terminal-box-line"></i> Tiến trình & Log Output</div>
        </div>
        <div className="console-box" style={{ minHeight: '480px' }}>{logs}</div>
      </div>

      {/* Video MP4 Player Preview */}
      <div className="card" style={{ alignItems: 'center' }}>
        <div className="card-header" style={{ width: '100%' }}>
          <div className="card-title"><i className="ri-play-circle-line"></i> Trình Xem Trước Video MP4</div>
        </div>
        <div className="video-preview-box">
          {videoSrc ? (
            <video key={videoSrc} controls autoPlay>
              <source src={videoSrc} type="video/mp4" />
              Trình duyệt không hỗ trợ video MP4.
            </video>
          ) : (
            <div className="video-placeholder">
              <i className="ri-movie-line" style={{ fontSize: '56px', color: 'var(--primary)', marginBottom: '12px' }}></i>
              <p style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '16px' }}>Chưa Có Video Được Chọn</p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px', lineHeight: '1.5' }}>
                Hãy thực hiện tạo video mới từ AI Agent Antigravity.<br />
                Video MP4 sẽ tự động hiển thị và mở xem tại đây ngay khi gen xong!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 4. Muse AI Chat Studio Component (With Multi-Thread Support & Persistent State)
function ChatStudioTab({ addToast }) {
  const [threads, setThreads] = useState([
    {
      id: 'thread-default',
      title: 'Đoạn chat #1',
      messages: [
        { role: 'assistant', text: '👋 Xin chào! Tôi là Meta Muse AI (Hatch). Bạn muốn sáng tạo nội dung, kịch bản hay tạo ảnh/video gì hôm nay?' }
      ]
    }
  ]);
  const [activeThreadId, setActiveThreadId] = useState('thread-default');
  const [editingThreadId, setEditingThreadId] = useState(null);
  const [editTitleText, setEditTitleText] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [threadPage, setThreadPage] = useState(1);
  const threadsPerPage = 5;

  const [prompt, setPrompt] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]); // Array of { id, name, previewUrl, url, filePath, isUploading }
  const [loading, setLoading] = useState(false);
  const [creatingThread, setCreatingThread] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Active thread helper
  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];
  const messages = activeThread ? activeThread.messages : [];

  // Pagination calculation
  const totalThreadPages = Math.ceil(threads.length / threadsPerPage) || 1;
  const currentThreads = threads.slice((threadPage - 1) * threadsPerPage, threadPage * threadsPerPage);

  const updateActiveMessages = (updater) => {
    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        const nextMsgs = typeof updater === 'function' ? updater(t.messages) : updater;
        return { ...t, messages: nextMsgs };
      }
      return t;
    }));
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Edit thread title helpers
  const startEditThread = (t, e) => {
    if (e) e.stopPropagation();
    setEditingThreadId(t.id);
    setEditTitleText(t.title);
  };

  const saveEditThread = (threadId) => {
    if (!editTitleText.trim()) {
      setEditingThreadId(null);
      return;
    }
    const newTitle = editTitleText.trim();
    setThreads(prev => prev.map(t => t.id === threadId ? { ...t, title: newTitle } : t));
    setEditingThreadId(null);
  };

  // Delete sub-chat thread helper
  const handleDeleteThread = (threadId, e) => {
    if (e) e.stopPropagation();
    setThreads(prev => {
      const filtered = prev.filter(t => t.id !== threadId);
      if (filtered.length === 0) {
        const defaultId = `thread-${Date.now()}`;
        setActiveThreadId(defaultId);
        return [{
          id: defaultId,
          title: 'Đoạn chat #1',
          messages: [
            { role: 'assistant', text: '👋 Xin chào! Tôi là Meta Muse AI (Hatch). Bạn muốn sáng tạo nội dung, kịch bản hay tạo ảnh/video gì hôm nay?' }
          ]
        }];
      }
      if (activeThreadId === threadId) {
        setActiveThreadId(filtered[0].id);
      }
      return filtered;
    });
  };

  // Create new Muse thread on backend and sync UI thread
  const handleCreateNewThread = async () => {
    setCreatingThread(true);

    try {
      const res = await fetch('/v1/chat/new', { method: 'POST' });
      const data = await res.json();

      const newId = `thread-${Date.now()}`;
      const newTitle = `Đoạn chat #${threads.length + 1}`;
      const initialMsgs = [
        { role: 'assistant', text: `✨ ${newTitle} đã được tạo và đồng bộ thành công với https://muse.ai/thread/new! Bạn có thể bắt đầu prompt chủ đề mới tại đây.` }
      ];

      setThreads(prev => [...prev, { id: newId, title: newTitle, messages: initialMsgs }]);
      setActiveThreadId(newId);
      setThreadPage(Math.ceil((threads.length + 1) / threadsPerPage));
      setPrompt('');
      setAttachedFiles([]);
      setDropdownOpen(false);
    } catch (err) {
      addToast('Lỗi Tạo Chat', err.message, 'error');
    } finally {
      setCreatingThread(false);
    }
  };

  // Upload single File object to backend /v1/upload
  const uploadSingleFile = async (fileObj) => {
    const fileId = Date.now() + Math.random().toString(36).substring(2, 7);
    const fileName = fileObj.name || `pasted_image_${Date.now()}.png`;

    // Local instant preview blob URL
    let previewUrl = null;
    if (fileObj.type && fileObj.type.startsWith('image/')) {
      try {
        previewUrl = URL.createObjectURL(fileObj);
      } catch (e) { }
    }

    setAttachedFiles(prev => [...prev, {
      id: fileId,
      name: fileName,
      previewUrl,
      url: null,
      filePath: null,
      isUploading: true
    }]);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target.result;
        const res = await fetch('/v1/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: fileName, data: base64Data })
        });
        const data = await res.json();
        if (data.ok) {
          setAttachedFiles(prev => prev.map(item => item.id === fileId ? {
            ...item,
            name: data.originalName || fileName,
            filePath: data.filePath,
            url: data.url,
            isUploading: false
          } : item));
          addToast('Đã thêm ảnh', `Ảnh: ${fileName}`, 'success');
        } else {
          addToast('Lỗi Upload', data.error || 'Upload failed', 'error');
          setAttachedFiles(prev => prev.filter(item => item.id !== fileId));
        }
      };
      reader.readAsDataURL(fileObj);
    } catch (err) {
      addToast('Lỗi Upload', err.message, 'error');
      setAttachedFiles(prev => prev.filter(item => item.id !== fileId));
    }
  };

  const handleFilesAdded = (fileList) => {
    if (!fileList || fileList.length === 0) return;
    for (let i = 0; i < fileList.length; i++) {
      uploadSingleFile(fileList[i]);
    }
  };

  // Handle Ctrl+V Clipboard Paste Event (Support Greenshot & Image Paste)
  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile();
        if (blob) {
          addToast('Clipboard Paste', '📋 Đã phát hiện và dán ảnh từ Greenshot!', 'info');
          uploadSingleFile(new File([blob], `greenshot_${Date.now()}.png`, { type: blob.type }));
        }
      }
    }
  };

  const removeFile = (id) => {
    setAttachedFiles(prev => {
      const target = prev.find(f => f.id === id);
      if (target && target.previewUrl) {
        try { URL.revokeObjectURL(target.previewUrl); } catch { }
      }
      return prev.filter(f => f.id !== id);
    });
    addToast('Đã xóa', 'Đã gỡ ảnh khỏi danh sách gửi.', 'info');
  };

  // Drag and Drop listeners over window when active
  useEffect(() => {
    const handleWindowDragOver = (e) => {
      e.preventDefault();
      setDragging(true);
    };
    const handleWindowDragLeave = (e) => {
      if (e.clientX === 0 && e.clientY === 0) {
        setDragging(false);
      }
    };
    const handleWindowDrop = (e) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        addToast('Kéo-Thả Ảnh', `📂 Đã thêm ${e.dataTransfer.files.length} ảnh vào hàng gửi!`, 'info');
        handleFilesAdded(e.dataTransfer.files);
      }
    };

    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('dragleave', handleWindowDragLeave);
    window.addEventListener('drop', handleWindowDrop);

    return () => {
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('dragleave', handleWindowDragLeave);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, []);

  const handleSend = async () => {
    if (!prompt.trim() && attachedFiles.length === 0) return;
    if (attachedFiles.some(f => f.isUploading)) {
      addToast('Chờ Upload', 'Vui lòng chờ ảnh tải lên hoàn tất...', 'info');
      return;
    }

    const fileListStr = attachedFiles.map(f => f.name).join(', ');
    const userText = prompt.trim() + (attachedFiles.length > 0 ? `\n📎 [Đính kèm ${attachedFiles.length} ảnh: ${fileListStr}]` : '');

    updateActiveMessages(prev => [...prev, { role: 'user', text: userText }]);
    setPrompt('');
    const filesToSend = attachedFiles.map(f => f.filePath).filter(Boolean);
    setAttachedFiles([]);
    setLoading(true);
    addToast('Gửi Prompt', '🚀 Đã gửi câu hỏi & danh sách ảnh tới Meta Muse AI...', 'info');

    try {
      const res = await fetch('/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'muse-spark-1.3',
          messages: [{ role: 'user', content: userText }],
          files: filesToSend.length > 0 ? filesToSend : undefined,
          stream: false
        })
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || JSON.stringify(data);
      updateActiveMessages(prev => [...prev, { role: 'assistant', text: reply }]);
      addToast('Muse AI Trả Lời', '✅ Đã nhận phản hồi từ Meta Muse AI!', 'success');
    } catch (err) {
      updateActiveMessages(prev => [...prev, { role: 'assistant', text: '❌ Lỗi kết nối: ' + err.message }]);
      addToast('Lỗi Kết Nối', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header" style={{ flexWrap: 'wrap', gap: '12px', overflow: 'visible' }}>
        <div className="card-title"><i className="ri-chat-3-line"></i> Giao diện Chat & Ra Lệnh cho Meta Muse AI</div>

        {/* Sub-chats Dropdown Menu Selector */}
        <div className="thread-dropdown-wrapper" ref={dropdownRef}>
          <button
            className="thread-dropdown-trigger"
            onClick={() => setDropdownOpen(prev => !prev)}
          >
            <i className="ri-message-3-fill" style={{ color: '#ef4444' }}></i>
            <span style={{ fontWeight: 700 }}>{activeThread ? activeThread.title : 'Chọn đoạn chat'}</span>
            <span className="thread-count-badge">{threads.length}</span>
            <i className={`ri-arrow-down-s-line arrow-icon ${dropdownOpen ? 'open' : ''}`}></i>
          </button>

          <button
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '13px', whiteSpace: 'nowrap' }}
            onClick={handleCreateNewThread}
            disabled={creatingThread}
          >
            {creatingThread ? (
              <><i className="ri-loader-4-line ri-spin"></i> Đang tạo...</>
            ) : (
              <><i className="ri-add-line"></i> Tạo đoạn chat mới</>
            )}
          </button>

          {/* Dropdown Menu List with Image 2 Pill Style, Scrollbar & Pagination */}
          {dropdownOpen && (
            <div className="thread-dropdown-menu">
              <div className="thread-dropdown-header">
                <span>📋 DANH SÁCH ĐOẠN CHAT ({threads.length})</span>
                <span style={{ fontSize: '11px', opacity: 0.7 }}>Double-click hoặc ✏️ để sửa tên</span>
              </div>

              {/* Scrollable list section */}
              <div className="thread-dropdown-scroll-list">
                {currentThreads.map((t) => {
                  const isActive = t.id === activeThreadId;
                  return (
                    <div
                      key={t.id}
                      className={`thread-item-card ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        setActiveThreadId(t.id);
                        setDropdownOpen(false);
                      }}
                    >
                      <div className="thread-item-main">
                        <i className="ri-chat-1-fill thread-item-icon"></i>
                        {editingThreadId === t.id ? (
                          <input
                            type="text"
                            className="thread-title-input"
                            value={editTitleText}
                            autoFocus
                            onChange={(e) => setEditTitleText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEditThread(t.id);
                              if (e.key === 'Escape') setEditingThreadId(null);
                            }}
                            onBlur={() => saveEditThread(t.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span
                            className="thread-item-title"
                            onDoubleClick={(e) => startEditThread(t, e)}
                          >
                            {t.title}
                          </span>
                        )}
                      </div>

                      <div className="thread-item-actions">
                        <button
                          className="thread-action-icon-btn"
                          onClick={(e) => startEditThread(t, e)}
                          title="Sửa tên đoạn chat"
                        >
                          <i className="ri-edit-line"></i>
                        </button>

                        {threads.length > 1 && (
                          <button
                            className="thread-action-icon-btn delete"
                            onClick={(e) => handleDeleteThread(t.id, e)}
                            title="Xóa đoạn chat này"
                          >
                            <i className="ri-close-line"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination bar */}
              {totalThreadPages > 1 && (
                <div className="thread-pagination-bar">
                  <button
                    className="thread-page-btn"
                    disabled={threadPage <= 1}
                    onClick={(e) => { e.stopPropagation(); setThreadPage(p => Math.max(1, p - 1)); }}
                  >
                    <i className="ri-arrow-left-s-line"></i> Prev
                  </button>
                  <span className="thread-page-text">Trang {threadPage} / {totalThreadPages}</span>
                  <button
                    className="thread-page-btn"
                    disabled={threadPage >= totalThreadPages}
                    onClick={(e) => { e.stopPropagation(); setThreadPage(p => Math.min(totalThreadPages, p + 1)); }}
                  >
                    Next <i className="ri-arrow-right-s-line"></i>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="chat-history">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role}`}>{m.text}</div>
        ))}
        {loading && <div className="chat-msg assistant"><i className="ri-loader-4-line ri-spin"></i> Muse AI đang xử lý & trả lời...</div>}
      </div>

      {/* Integrated Chat Input Box (Exact Design from Image 2) */}
      <div className={`chat-input-card-v2 ${dragging ? 'dragging' : ''}`}>
        {dragging && (
          <div className="drag-overlay-banner">
            <i className="ri-upload-cloud-2-line"></i>
            <span>Thả các file ảnh vào đây để thêm vào danh sách hàng gửi!</span>
          </div>
        )}

        {/* Thumbnail Row matching Image 2 */}
        {attachedFiles.length > 0 && (
          <div className="thumb-row-v2">
            {attachedFiles.map((f) => (
              <div key={f.id} className="thumb-card-v2">
                {f.previewUrl || f.url ? (
                  <img src={f.previewUrl || f.url} className="thumb-img-v2" alt={f.name} />
                ) : f.isUploading ? (
                  <div className="thumb-loading-spin"><i className="ri-loader-4-line ri-spin"></i></div>
                ) : (
                  <div className="thumb-fallback"><i className="ri-image-line"></i></div>
                )}
                {f.isUploading && (
                  <div className="thumb-loading-overlay">
                    <i className="ri-loader-4-line ri-spin"></i>
                  </div>
                )}
                <button
                  className="thumb-close-btn-v2"
                  onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                  title="Xóa ảnh"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Bar: [+] [Nhắn tin...] [Send ↑] */}
        <div className="chat-input-bottom-row">
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*,video/*"
            style={{ display: 'none' }}
            onChange={(e) => handleFilesAdded(e.target.files)}
          />
          <button
            className="attach-plus-btn"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            title="Đính kèm ảnh hoặc file"
          >
            +
          </button>

          <textarea
            className="chat-textarea-v2"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            onPaste={handlePaste}
            placeholder="Nhắn tin..."
            rows="1"
          ></textarea>

          <button
            className="chat-send-btn-v2"
            onClick={handleSend}
            disabled={loading || attachedFiles.some(f => f.isUploading)}
            title="Gửi prompt"
          >
            {loading ? <i className="ri-loader-4-line ri-spin"></i> : <i className="ri-arrow-up-line"></i>}
          </button>
        </div>
      </div>
    </div>
  );
}

// 5. Media Manager & Downloads Component
function MediaManagerTab({ addToast }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDownloads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/v1/downloads');
      const data = await res.json();
      setFiles(data.files || []);
      addToast('Làm Mới', 'Đã làm mới danh sách media!', 'info');
    } catch (err) {
      addToast('Lỗi', err.message, 'error');
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
        <div style={{ color: 'var(--text-muted)' }}>Chưa có file nào trong thư mục ./downloads</div>
      ) : (
        <div className="media-grid">
          {files.map((f, i) => {
            const isImg = f.name.match(/\.(png|jpe?g|webp|gif|svg)$/i);
            const isVideo = f.name.match(/\.(mp4|webm|mov)$/i);
            const mediaUrl = `/v1/downloads/${encodeURIComponent(f.name)}`;

            return (
              <div key={i} className="media-card">
                <div style={{ background: '#000', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {isImg ? (
                    <img src={mediaUrl} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} alt={f.name} />
                  ) : isVideo ? (
                    <video src={mediaUrl} style={{ maxHeight: '100%', maxWidth: '100%' }} controls></video>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '40px' }}><i className="ri-file-3-line"></i></div>
                  )}
                </div>
                <div className="media-card-body">
                  <div className="media-card-title">{isImg ? '🖼️' : isVideo ? '🎬' : '📄'} {f.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Kích thước: {(f.size / (1024 * 1024)).toFixed(2)} MB</div>
                  <a href={mediaUrl} download className="btn btn-secondary" style={{ marginTop: '6px' }}>
                    <i className="ri-download-cloud-line"></i> Tải Về File {isImg ? 'Ảnh' : isVideo ? 'Video' : ''}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// 6. System Inspector Component
function SystemInspectorTab({ status }) {
  return (
    <div className="grid-2">
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="ri-server-line"></i> Thông tin Server & API Endpoints</div>
        </div>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
          Server đang chạy tại <strong>http://127.0.0.1:8787</strong>.<br />
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
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch('/health');
      const data = await res.json();
      setStatus(data);
    } catch { }
  };

  useEffect(() => {
    fetchStatus();
    const timer = setInterval(fetchStatus, 15000);

    const preventDefault = (e) => e.preventDefault();
    window.addEventListener('dragover', preventDefault);
    window.addEventListener('drop', preventDefault);

    return () => {
      clearInterval(timer);
      window.removeEventListener('dragover', preventDefault);
      window.removeEventListener('drop', preventDefault);
    };
  }, []);


  return (
    <div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <HeaderNav status={status} />

      <div className="main-container">
        <div className="nav-tabs">
          <button className={`tab-btn ${tab === 'video' ? 'active' : ''}`} onClick={() => setTab('video')}>
            <i className="ri-clapperboard-fill"></i> Remotion Video Monitor
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

        {/* Persistent Tab Views (Chat state & prompt history stay intact on tab switch) */}
        <div style={{ display: tab === 'video' ? 'block' : 'none' }}>
          <VideoStudioTab />
        </div>
        <div style={{ display: tab === 'chat' ? 'block' : 'none' }}>
          <ChatStudioTab addToast={addToast} />
        </div>
        <div style={{ display: tab === 'media' ? 'block' : 'none' }}>
          <MediaManagerTab addToast={addToast} />
        </div>
        <div style={{ display: tab === 'system' ? 'block' : 'none' }}>
          <SystemInspectorTab status={status} />
        </div>
      </div>

      <footer>
        <p>🚀 FZ Studio Web • Red Mascot Design System • MCP & AI Monitoring Mode</p>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
