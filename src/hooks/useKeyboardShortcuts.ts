import { useEffect } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useRoomStore } from '../store/useRoomStore';
import { useCursorStore } from '../store/useCursorStore';
import toast from 'react-hot-toast';

interface KeyboardShortcutOptions {
  onOpenJoinModal?: () => void;
  onOpenShareModal?: () => void;
  onLeaveRoom?: () => void;
}

export function useKeyboardShortcuts(options: KeyboardShortcutOptions = {}) {
  const { onOpenJoinModal, onOpenShareModal, onLeaveRoom } = options;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isInput = (e.target as HTMLElement)?.closest('input, textarea');

      // Slash key activates cursor chat if not inside a text field
      if (e.key === '/' && !isInput) {
        e.preventDefault();
        useCursorStore.getState().setCursorChatInput('');
        return;
      }

      // Escape key cancels cursor chat or leaves room
      if (e.key === 'Escape') {
        if (useCursorStore.getState().cursorChatInput !== null) {
          useCursorStore.getState().setCursorChatInput(null);
          return;
        }
        if (onLeaveRoom) {
          onLeaveRoom();
        }
        return;
      }

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (!isCtrlOrCmd) return;

      const key = e.key.toLowerCase();

      // Ctrl + D -> Toggle Dark Mode
      if (key === 'd') {
        e.preventDefault();
        useSettingsStore.getState().toggleTheme();
        const currentTheme = useSettingsStore.getState().theme;
        toast(`Switched to ${currentTheme} mode`, { icon: currentTheme === 'dark' ? '🌙' : '☀️' });
        return;
      }

      // Ctrl + J -> Join Room modal
      if (key === 'j') {
        e.preventDefault();
        if (onOpenJoinModal) {
          onOpenJoinModal();
        }
        return;
      }

      // Ctrl + C -> Copy Room Link (only when not selecting text)
      if (key === 'c' && !isInput && window.getSelection()?.toString().length === 0) {
        const roomId = useRoomStore.getState().roomId;
        if (roomId) {
          e.preventDefault();
          const inviteUrl = `${window.location.origin}/room/${roomId}`;
          navigator.clipboard.writeText(inviteUrl);
          toast.success('Room invite link copied to clipboard! 📋');
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenJoinModal, onOpenShareModal, onLeaveRoom]);
}
