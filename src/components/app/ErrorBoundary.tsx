import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {

    // if (this.state.hasError) {
      return (
        <div className="flex flex-col  items-center justify-center w-full h-[100vh] gap-4">
          {/* Logo image can be added here */}
          {/* <img
            src="/path-to-your-logo.png"
            alt="offline-logo"
            className="w-48"
          /> */}
          <div className="flex flex-col items-center justify-center relative">
            <h2 className="text-2xl font-semibold">
              Something went wrong!
            </h2>
            <button
              className="mt-4 px-4 py-2 bg-primary text-black rounded hover:bg-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={() => {
            
                window.localStorage.clear();
                window.location.href = '/';
                // window.location.reload();
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    // }

    // return this.props.children;
  }
}

export default ErrorBoundary;