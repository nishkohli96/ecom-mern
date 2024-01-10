import { Component } from 'react';

/**
 * Can Also try using this library
 * https://www.npmjs.com/package/react-error-boundary
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      /* You can render any custom fallback UI */
      return this.props.fallback;
    }
    return this.props.children;
  }
}
