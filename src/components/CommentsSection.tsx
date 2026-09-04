import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CommentItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Heart,
  Reply,
  Send,
  User,
  Shield,
  CheckCircle2,
  Sparkles,
  CornerDownRight,
} from 'lucide-react';

interface CommentsSectionProps {
  targetId: string;
  targetType: 'blog' | 'project' | 'app' | 'general';
  targetTitle?: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  targetId,
  targetType,
  targetTitle,
}) => {
  const { comments, addComment, toggleLikeComment, getCommentsForTarget, t } = useApp();

  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [content, setContent] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyName, setReplyName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPostedSuccess, setHasPostedSuccess] = useState(false);

  const targetComments = getCommentsForTarget(targetId);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      addComment({
        targetId,
        targetType,
        authorName: authorName.trim() || 'Anonymous Explorer',
        authorRole: authorRole.trim() || 'Community Member',
        content: content.trim(),
        parentId: null,
      });

      setContent('');
      setIsSubmitting(false);
      setHasPostedSuccess(true);
      setTimeout(() => setHasPostedSuccess(false), 4000);
    }, 250);
  };

  const handlePostReply = (parentId: string) => {
    if (!replyContent.trim()) return;

    addComment({
      targetId,
      targetType,
      authorName: replyName.trim() || 'Anonymous Explorer',
      authorRole: 'Community Member',
      content: replyContent.trim(),
      parentId,
    });

    setReplyContent('');
    setReplyingToId(null);
  };

  return (
    <section id={`comments-section-${targetId}`} className="mt-12 pt-8 border-t border-slate-800/80">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-brand text-slate-100 flex items-center gap-2">
              <span>{t('comments', 'Community Discussion')}</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-amber-400 font-mono">
                {targetComments.length}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Share your insights and interact on {targetTitle || 'this post'}
            </p>
          </div>
        </div>
      </div>

      {/* New Comment Submission Box */}
      <form
        onSubmit={handlePostComment}
        className="mb-10 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg backdrop-blur-sm space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Your Name / Alias
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Role / Specialty (Optional)
            </label>
            <div className="relative">
              <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="e.g. AI Engineer, Solopreneur"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
            Your Comment
          </label>
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share technical thoughts, feedback, or questions..."
            required
            className="w-full p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all resize-none"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Markdown formatting supported</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md shadow-amber-400/10"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Posting...' : 'Post Comment'}</span>
          </button>
        </div>

        {hasPostedSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Your comment has been published to the discussion!</span>
          </motion.div>
        )}
      </form>

      {/* Comment List */}
      <div className="space-y-4">
        {targetComments.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/30 border border-dashed border-slate-800 text-slate-500">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40 text-amber-400" />
            <p className="text-sm font-sans font-medium text-slate-400">
              No comments yet on this {targetType}.
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Be the first to share your thoughts or start a technical discussion!
            </p>
          </div>
        ) : (
          targetComments.map((comment) => (
            <div
              key={comment.id}
              className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700/80 transition-all space-y-3"
            >
              {/* Comment Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500/20 to-cyan-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 font-mono font-bold text-xs">
                    {comment.authorName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-200">
                        {comment.authorName}
                      </span>
                      {comment.authorRole && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-400 border border-slate-700/50 text-[10px] font-mono">
                          {comment.authorRole}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      {comment.timestamp}
                    </span>
                  </div>
                </div>

                {/* Like Button */}
                <button
                  onClick={() => toggleLikeComment(comment.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                    comment.userLiked
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50'
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      comment.userLiked ? 'fill-rose-500 text-rose-500' : ''
                    }`}
                  />
                  <span>{comment.likes}</span>
                </button>
              </div>

              {/* Comment Text */}
              <p className="text-sm text-slate-300 leading-relaxed font-sans pl-12 whitespace-pre-line">
                {comment.content}
              </p>

              {/* Actions */}
              <div className="pl-12 pt-1 flex items-center gap-4">
                <button
                  onClick={() =>
                    setReplyingToId(replyingToId === comment.id ? null : comment.id)
                  }
                  className="flex items-center gap-1.5 text-xs font-mono text-amber-400/80 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>{replyingToId === comment.id ? 'Cancel Reply' : 'Reply'}</span>
                </button>
              </div>

              {/* Reply Form */}
              <AnimatePresence>
                {replyingToId === comment.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pl-12 pt-2 space-y-2.5 overflow-hidden"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={replyName}
                        onChange={(e) => setReplyName(e.target.value)}
                        placeholder="Your Name (Optional)"
                        className="w-1/3 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400/60 text-xs text-slate-200 placeholder-slate-600 outline-none"
                      />
                      <input
                        type="text"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={`Reply to ${comment.authorName}...`}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400/60 text-xs text-slate-200 placeholder-slate-600 outline-none"
                      />
                      <button
                        onClick={() => handlePostReply(comment.id)}
                        className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs font-mono transition-colors"
                      >
                        Reply
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Nested Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="pl-10 pt-2 space-y-2.5 border-l-2 border-amber-400/20 ml-4">
                  {comment.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CornerDownRight className="w-3.5 h-3.5 text-amber-400" />
                          <span className="font-bold text-xs text-slate-200">
                            {reply.authorName}
                          </span>
                          {reply.authorRole && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20 text-[9px] font-mono">
                              {reply.authorRole}
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-slate-500">
                            {reply.timestamp}
                          </span>
                        </div>

                        <button
                          onClick={() => toggleLikeComment(reply.id)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono transition-all ${
                            reply.userLiked
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          <Heart
                            className={`w-3 h-3 ${
                              reply.userLiked ? 'fill-rose-500 text-rose-500' : ''
                            }`}
                          />
                          <span>{reply.likes}</span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-300 pl-5">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
};
