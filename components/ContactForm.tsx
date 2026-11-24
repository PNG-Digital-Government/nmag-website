"use client";

/**
 * Contact form. For now it opens the visitor's email app with the message
 * filled in and addressed to the museum. It can later be switched to send
 * through the backend (for example Amazon SES) without changing the page.
 */
export function ContactForm({ to }: { to: string }) {
  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const subject = `[Website] ${f.get("topic")} from ${f.get("name")}`;
        const body = `${f.get("message")}\n\n${f.get("name")}\n${f.get("email")}`;
        window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }}
    >
      <label>
        Name
        <input name="name" autoComplete="name" required />
      </label>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        Topic
        <select name="topic">
          <option>General enquiry</option>
          <option>School visit booking</option>
          <option>Collection research</option>
          <option>Media</option>
        </select>
      </label>
      <label>
        Message
        <textarea name="message" rows={5} required />
      </label>
      <button className="btn btn-primary" type="submit">
        Send message
      </button>
      <small style={{ color: "var(--muted)" }}>This opens your email app with the message ready to send.</small>
    </form>
  );
}
