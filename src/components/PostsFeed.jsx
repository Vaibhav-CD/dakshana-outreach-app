import React, { useState } from 'react'
import {
  Share2,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Heart,
  MessageSquare,
  School,
  Users,
  Send,
  Plus,
  Upload,
  X,
  Filter,
  Check,
  MapPin,
  Calendar
} from 'lucide-react'

export default function PostsFeed({
  currentUser,
  posts = [],
  onAddPost,
  onSelectIntern
}) {
  const [filter, setFilter] = useState('all') // 'all' | 'completed' | 'batch_1' | 'batch_2'
  const [showComposer, setShowComposer] = useState(false)

  // Composer State
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const [schoolName, setSchoolName] = useState('')
  const [studentsReached, setStudentsReached] = useState('25')
  const [selectedPresetPhoto, setSelectedPresetPhoto] = useState('')
  const [localImagePreview, setLocalImagePreview] = useState('')

  // Comments & Likes local state for instant interactivity
  const [cheeredPosts, setCheeredPosts] = useState({})
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null)
  const [newCommentText, setNewCommentText] = useState('')
  const [localComments, setLocalComments] = useState({})

  const photoPresets = [
    { label: 'Science Lab', url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop&q=80' },
    { label: 'Math Session', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80' },
    { label: 'Classroom', url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80' },
    { label: 'Reading Circle', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80' }
  ]

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLocalImagePreview(reader.result)
        setPhotoUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitPost = (e) => {
    e.preventDefault()
    if (!content.trim() && !title.trim()) return

    const newPost = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorPhoto: currentUser.photo,
      batch: currentUser.batch || 'Batch 1',
      wing: currentUser.department || 'Outreach Wing',
      createdAt: 'Just now',
      title: title.trim() || 'Outreach Milestone Update',
      content: content.trim(),
      photoUrl: photoUrl || localImagePreview || selectedPresetPhoto || null,
      schoolName: isCompleted ? schoolName.trim() : null,
      isCompleted: Boolean(isCompleted),
      visitsLogged: isCompleted ? 1 : 0,
      studentsReached: isCompleted ? parseInt(studentsReached || '0', 10) : 0,
      cheersCount: 1,
      comments: []
    }

    if (onAddPost) {
      onAddPost(newPost)
    }

    // Reset composer
    setTitle('')
    setContent('')
    setPhotoUrl('')
    setLocalImagePreview('')
    setSelectedPresetPhoto('')
    setIsCompleted(false)
    setSchoolName('')
    setShowComposer(false)
  }

  const handleToggleCheer = (postId) => {
    setCheeredPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }))
  }

  const handleAddComment = (postId) => {
    if (!newCommentText.trim()) return
    const newComm = {
      id: `c-${Date.now()}`,
      authorName: currentUser.name,
      role: currentUser.role,
      text: newCommentText.trim(),
      time: 'Just now'
    }

    setLocalComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComm]
    }))
    setNewCommentText('')
  }

  // Filter posts
  const filteredPosts = posts.filter(post => {
    if (filter === 'completed') return post.isCompleted
    if (filter === 'batch_1') return post.batch === 'Batch 1'
    if (filter === 'batch_2') return post.batch === 'Batch 2'
    return true
  })

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#EBF7F0] text-[#0A643B] text-xs font-bold mb-1.5 border border-[#0A643B]/20">
            <Share2 className="w-3.5 h-3.5" />
            <span>Community Outreach Wall</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Scholar Field Posts & Activity Tracker
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Share school visit stories, photos, and mark outreach activities as completed for leadership tracking.
          </p>
        </div>

        <button
          onClick={() => setShowComposer(!showComposer)}
          className="px-5 py-2.5 rounded-2xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold text-xs flex items-center shadow-md transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          {showComposer ? 'Close Composer' : 'Share Outreach Post'}
        </button>
      </div>

      {/* CREATE POST COMPOSER */}
      {showComposer && (
        <div className="bg-white rounded-3xl p-6 border-2 border-[#0A643B]/30 shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
            <img src={currentUser.photo} className="w-10 h-10 rounded-xl object-cover border border-[#0A643B]/30" alt="" />
            <div>
              <span className="font-bold text-slate-900 text-sm block">{currentUser.name}</span>
              <span className="text-[11px] text-[#0A643B] font-semibold">{currentUser.title} • {currentUser.batch || 'Batch 1'}</span>
            </div>
          </div>

          <form onSubmit={handleSubmitPost} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Post Title / Activity Heading</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Conducted Robotics Circuit Session at ZP School"
                className="w-full text-xs font-semibold rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Outreach Story & Notes *</label>
              <textarea
                required
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write about what you taught, student response, challenges faced, or key takeaways..."
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden leading-relaxed"
              />
            </div>

            {/* Photo Attachment Section */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 text-xs block flex items-center">
                <ImageIcon className="w-4 h-4 mr-1.5 text-[#0A643B]" />
                Attach Outreach Photos (Upload or Pick Sample)
              </span>

              {/* Local File Upload */}
              <div className="flex items-center space-x-3">
                <label className="px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs cursor-pointer inline-flex items-center shadow-2xs">
                  <Upload className="w-3.5 h-3.5 mr-1.5 text-[#0A643B]" />
                  Upload from Device
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
                <span className="text-[11px] text-slate-500">or choose sample classroom photo:</span>
              </div>

              {/* Sample Preset Photos */}
              <div className="grid grid-cols-4 gap-2">
                {photoPresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => { setSelectedPresetPhoto(preset.url); setPhotoUrl(preset.url); setLocalImagePreview('') }}
                    className={`p-1 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedPresetPhoto === preset.url
                        ? 'border-[#0A643B] ring-2 ring-[#0A643B]/30 bg-emerald-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <img src={preset.url} alt="" className="w-full h-12 object-cover rounded-lg mb-1" />
                    <span className="text-[10px] font-bold text-slate-700 block truncate">{preset.label}</span>
                  </button>
                ))}
              </div>

              {/* Preview */}
              {(localImagePreview || photoUrl) && (
                <div className="relative rounded-xl overflow-hidden border border-slate-300 max-h-48 mt-2">
                  <img src={localImagePreview || photoUrl} alt="Preview" className="w-full h-44 object-cover" />
                  <button
                    type="button"
                    onClick={() => { setPhotoUrl(''); setLocalImagePreview(''); setSelectedPresetPhoto('') }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* "MARK AS DONE" OUTREACH ACTIVITY CHECKBOX */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={(e) => setIsCompleted(e.target.checked)}
                  className="w-4 h-4 rounded-md text-[#0A643B] focus:ring-[#0A643B] border-slate-300 mt-0.5 cursor-pointer"
                />
                <div>
                  <span className="font-extrabold text-[#0A643B] text-xs flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Mark as Completed Outreach Activity
                  </span>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Check this if you are reporting a verified completed school visit. This will log your visit progress for Junior Secretary and Senior Secretary tracking.
                  </p>
                </div>
              </label>

              {isCompleted && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-emerald-200/60">
                  <div>
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">School / Center Name *</label>
                    <input
                      required
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="e.g. ZP High School, Taluka Haveli"
                      className="w-full text-xs rounded-xl border border-slate-300 p-2 bg-white focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">Students Attended *</label>
                    <input
                      required
                      type="number"
                      value={studentsReached}
                      onChange={(e) => setStudentsReached(e.target.value)}
                      placeholder="25"
                      className="w-full text-xs rounded-xl border border-slate-300 p-2 bg-white focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowComposer(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold text-xs flex items-center shadow-xs cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Publish to Community Wall
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold overflow-x-auto scrollbar-none">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer whitespace-nowrap text-center ${
            filter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          All Posts ({posts.length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer whitespace-nowrap text-center flex items-center justify-center gap-1.5 ${
            filter === 'completed' ? 'bg-[#0A643B] text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Completed Activities ({posts.filter(p => p.isCompleted).length})
        </button>
        <button
          onClick={() => setFilter('batch_1')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer whitespace-nowrap text-center ${
            filter === 'batch_1' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Batch 1
        </button>
        <button
          onClick={() => setFilter('batch_2')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer whitespace-nowrap text-center ${
            filter === 'batch_2' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Batch 2
        </button>
      </div>

      {/* Posts Feed List */}
      <div className="space-y-5">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
            <Share2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-600 font-bold text-sm">No posts found in this category</p>
            <p className="text-slate-400 text-xs mt-1">Be the first to share an outreach update!</p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isCheered = cheeredPosts[post.id]
            const totalCheers = (post.cheersCount || 0) + (isCheered ? 1 : 0)
            const commentsList = [...(post.comments || []), ...(localComments[post.id] || [])]
            const showComments = activeCommentsPostId === post.id

            return (
              <div
                key={post.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow space-y-4"
              >
                {/* Author Info & Status Badge */}
                <div className="flex items-start justify-between">
                  <div
                    onClick={() => onSelectIntern && onSelectIntern({ id: post.authorId, name: post.authorName, photo: post.authorPhoto, batch: post.batch })}
                    className="flex items-center space-x-3 cursor-pointer group"
                  >
                    <img
                      src={post.authorPhoto}
                      alt={post.authorName}
                      className="w-11 h-11 rounded-2xl object-cover border-2 border-slate-200 group-hover:border-[#0A643B] transition-colors"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-slate-900 text-sm group-hover:text-[#0A643B] transition-colors">
                          {post.authorName}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-slate-100 text-slate-600">
                          {post.batch}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block">{post.createdAt}</span>
                    </div>
                  </div>

                  {/* Completed Badge */}
                  {post.isCompleted && (
                    <span className="inline-flex items-center text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#EBF7F0] text-[#0A643B] border border-[#0A643B]/30 shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Completed Activity
                    </span>
                  )}
                </div>

                {/* Post Content */}
                <div className="space-y-2 text-xs">
                  {post.title && (
                    <h4 className="font-extrabold text-slate-900 text-base">
                      {post.title}
                    </h4>
                  )}
                  <p className="text-slate-700 leading-relaxed text-xs sm:text-sm whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {/* School Location Pill if Completed */}
                {post.schoolName && (
                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-[#0A643B] border border-emerald-200 text-xs font-semibold">
                    <School className="w-4 h-4 text-[#0A643B]" />
                    <span>School: <strong>{post.schoolName}</strong></span>
                    {post.studentsReached > 0 && (
                      <span className="text-slate-500 font-normal">• {post.studentsReached} students attended</span>
                    )}
                  </div>
                )}

                {/* Attached Photo */}
                {post.photoUrl && (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-80 shadow-2xs">
                    <img
                      src={post.photoUrl}
                      alt="Outreach"
                      className="w-full h-64 sm:h-80 object-cover hover:scale-101 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Post Footer Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => handleToggleCheer(post.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                        isCheered
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isCheered ? 'fill-rose-600' : ''}`} />
                      <span>{totalCheers} Cheers</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveCommentsPostId(showComments ? null : post.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      <span>{commentsList.length} Notes</span>
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                {showComments && (
                  <div className="pt-3 border-t border-slate-100 space-y-3 bg-slate-50/70 p-3.5 rounded-2xl">
                    <div className="space-y-2">
                      {commentsList.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic">No notes yet. Leave some encouragement!</p>
                      ) : (
                        commentsList.map(c => (
                          <div key={c.id} className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                            <div className="flex justify-between items-center mb-0.5">
                              <span className="font-bold text-slate-900">{c.authorName}</span>
                              <span className="text-[10px] text-slate-400">{c.time}</span>
                            </div>
                            <p className="text-slate-600">{c.text}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <input
                        type="text"
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Add an encouraging note..."
                        className="flex-1 text-xs rounded-xl border border-slate-300 p-2 bg-white focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(post.id)}
                        className="p-2 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )
          })
        )}
      </div>

    </div>
  )
}
