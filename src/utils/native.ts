import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

/**
 * Initialize native device capabilities on mobile platforms.
 * Safely guards against non-native browser environments.
 */
export async function initNativeApp(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    // Hide splash screen smoothly after app initialization
    await SplashScreen.hide();
  } catch (err) {
    console.debug('Splash screen hide error:', err);
  }

  try {
    // Configure native status bar
    await StatusBar.setStyle({ style: Style.Light });
    if (Capacitor.getPlatform() === 'android') {
      await StatusBar.setBackgroundColor({ color: '#FFFFFF' });
      await StatusBar.setOverlaysWebView({ overlay: false });
    }
  } catch (err) {
    console.debug('Status bar configuration error:', err);
  }

  try {
    // Configure mobile keyboard accessory bar
    await Keyboard.setAccessoryBarVisible({ isVisible: true });
  } catch (err) {
    console.debug('Keyboard configuration error:', err);
  }
}

/**
 * Trigger subtle tactile feedback for interactive actions like
 * completing checklists, checking itinerary events, and switching tabs.
 */
export async function triggerHaptic(
  type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' = 'light'
): Promise<void> {
  try {
    if (Capacitor.isNativePlatform()) {
      if (type === 'success') {
        await Haptics.notification({ type: NotificationType.Success });
      } else if (type === 'warning') {
        await Haptics.notification({ type: NotificationType.Warning });
      } else if (type === 'medium') {
        await Haptics.impact({ style: ImpactStyle.Medium });
      } else if (type === 'heavy') {
        await Haptics.impact({ style: ImpactStyle.Heavy });
      } else {
        await Haptics.impact({ style: ImpactStyle.Light });
      }
    } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      // Gentle vibration fallback for mobile web browsers
      if (type === 'success') navigator.vibrate([15, 30, 15]);
      else navigator.vibrate(10);
    }
  } catch {
    // Graceful silent fallback if device doesn't support vibration
  }
}

/**
 * Share trip itinerary using native mobile share sheet (WhatsApp, iMessage, Mail, AirDrop)
 * or fallback to Web Share API and clipboard.
 */
export async function shareTripContent(payload: {
  title: string;
  text: string;
  url?: string;
}): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share(payload);
      return true;
    } catch (err: unknown) {
      if ((err as Error)?.name !== 'AbortError') {
        console.debug('Share error, falling back to clipboard:', err);
      }
    }
  }

  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(payload.text);
    return true;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}
