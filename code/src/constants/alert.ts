/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Alert {
  /**
   * Show success alert.
   * @param message The message to show.
   */
  export function success(message: string): void {
    //
  }

  /**
   * Show error alert.
   * @param message The message to show.
   */
  export function error(message: string | Error): void {
    //
  }

  /**
   * Show information alert.
   * @param message The message to show.
   */
  export function info(message: string): void {
    //
  }

  /**
   * Set an alert for the next page.
   * @param props The alert props.
   */
  export function set({ type, message }: AlertProps): void {
    //
  }

  /**
   * Check for set alerts.
   */
  export function check(): void {
    //
  }

  /**
   * Display an error message. Explicit if specified or on development only.
   * @param message The message to display.
   * @param shouldBeExplicit True if the raw error message should be displayed.
   */
  export function report(message: string, shouldBeExplicit?: boolean): void {
    //
  }
}

export enum AlertType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
}

export default Alert;

interface AlertProps {
  type: AlertType;
  message: string;
}
