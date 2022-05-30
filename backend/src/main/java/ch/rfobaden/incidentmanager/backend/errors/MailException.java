package ch.rfobaden.incidentmanager.backend.errors;

/**
 * {@code MailException} is caused when a mail could not be sent successfully.
 */
public final class MailException extends RuntimeException {
    /**
     * Create a new {@code MailException}.
     *
     * @param message The error message.
     */
    public MailException(String message) {
        super(message);
    }
}
