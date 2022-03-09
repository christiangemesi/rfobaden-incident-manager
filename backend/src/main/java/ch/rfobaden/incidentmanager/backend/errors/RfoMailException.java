package ch.rfobaden.incidentmanager.backend.errors;

public final class RfoMailException extends RuntimeException {
    private final String receiver;
    private final String text;

    public RfoMailException(String message, String receiver, String text) {
        super(message);
        this.receiver = receiver;
        this.text = text;
    }

    public String getReceiver() {
        return receiver;
    }

    public String getText() {
        return text;
    }
}
