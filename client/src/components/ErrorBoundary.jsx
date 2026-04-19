import React from "react";
import { RefreshCw, TriangleAlert } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      message: "",
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || "The dashboard hit an unexpected rendering issue.",
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Smart Home dashboard render error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <section className="glass-panel panel-highlight w-full max-w-2xl rounded-[32px] p-6 sm:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-rose-400/10 p-3 text-rose-200">
                <TriangleAlert className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-200/80">
                  Dashboard recovery
                </p>
                <h1 className="mt-3 font-display text-3xl text-white">The command center needs a refresh</h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                  A rendering error interrupted the interface before it could finish loading. Reload the
                  dashboard to restore the latest cloud-synced device state.
                </p>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-300">
              {this.state.message}
            </div>

            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
            >
              <RefreshCw className="h-4 w-4" />
              Reload dashboard
            </button>
          </div>
        </section>
      </main>
    );
  }
}

export default ErrorBoundary;
