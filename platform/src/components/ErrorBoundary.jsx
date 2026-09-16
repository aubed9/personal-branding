import React from 'react';

/**
 * DIGITAL MARKET — React Error Boundary (Requirement R8.3)
 * Catches JavaScript errors anywhere in child component tree,
 * logs error information, and displays a resilient Persian fallback UI.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6" dir="rtl">
          <div className="max-w-lg w-full bg-slate-800 border border-rose-500/30 rounded-2xl p-8 shadow-2xl space-y-6">
            <div className="flex items-center space-x-3 space-x-reverse text-rose-400">
              <span className="text-3xl">⚠️</span>
              <h2 className="text-xl font-bold">خطایی در نمایش صفحه رخ داد</h2>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              متأسفانه در اجرای این بخش از سامانه خطایی رخ داده است. داده‌های استراتژیک و پیشرفت پرونده شما در حافظه سیستم امن است.
            </p>

            {this.state.error && (
              <div className="bg-slate-950/70 border border-slate-700/50 rounded-lg p-3 text-xs font-mono text-rose-300 overflow-x-auto max-h-36">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition"
              >
                تلاش مجدد
              </button>
              <button
                onClick={this.handleReload}
                className="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-sm font-semibold transition"
              >
                بارگذاری مجدد صفحه
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
