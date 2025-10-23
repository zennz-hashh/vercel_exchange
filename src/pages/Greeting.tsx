import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';

export function Greeting({ onContinue }: { onContinue: () => void }) {
  const { user } = useApp();

  useEffect(() => {
    if (user?.greetingVoiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        t(user.locale, 'greeting.hello', { name: user.displayName })
      );
      utterance.lang = user.locale === 'id' ? 'id-ID' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl animate-fade-in">
        <div className="mb-8">
          <div className="inline-block p-6 bg-white rounded-full shadow-xl mb-6 animate-bounce">
            <span className="text-6xl">👋</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 animate-slide-up">
          {t(user.locale, 'greeting.hello', { name: user.displayName })}
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 mb-12 animate-slide-up-delay">
          {t(user.locale, 'greeting.welcome')}
        </p>

        <button
          onClick={onContinue}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {t(user.locale, 'greeting.continue')}
        </button>
      </div>
    </div>
  );
}
