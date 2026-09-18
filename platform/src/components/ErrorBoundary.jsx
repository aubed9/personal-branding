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
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6" dir="rtl">
          <div className="max-w-lg w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-8 space-y-6">
            <div className="flex items-center space-x-3 space-x-reverse text-white">
              <span className="text-2xl">⚠️</span>
              <h2 className="text-lg font-bold">خطایی در نمایش بخش رخ داد</h2>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed">
              در اجرای این نما خطایی شناسایی شد. اطلاعات ثبت‌شده در حافظه ایمن است و آسیبی ندیده است.
            </p>

            {this.state.error && (
              <div className="bg-[#050505] border border-white/10 rounded-lg p-3 text-xs font-mono text-zinc-300 overflow-x-auto max-h-36">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 py-2.5 px-4 bg-white text-black hover:bg-zinc-200 rounded-lg text-sm font-semibold transition"
              >
                تلاش مجدد
              </button>
              <button
                onClick={this.handleReload}
                className="flex-1 py-2.5 px-4 bg-transparent border border-white/30 hover:border-white text-white rounded-lg text-sm font-semibold transition"
              >
                بارگذاری مجدد
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
