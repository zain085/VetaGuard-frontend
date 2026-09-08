import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiMail } from "react-icons/fi";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { contactService } from "../../services/contact.service";

export default function Contact() {
  useDocumentTitle("Contact");
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    try {
      await contactService.submit(values);
      setSent(true);
      reset();
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to send your message");
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <FiMail className="mx-auto h-8 w-8" style={{ color: "var(--color-primary)" }} />
        <h1 className="mt-3 text-2xl font-semibold text-text">Get in Touch</h1>
        <p className="mt-1 text-sm text-text-muted">
          Questions, feedback, or partnership inquiries — we'd love to hear from you.
        </p>
      </div>

      {sent ? (
        <div className="mt-8 rounded-lg border border-success/30 bg-success/10 p-6 text-center theme-transition">
          <p className="text-sm font-medium text-success">Message sent — thank you!</p>
          <p className="mt-1 text-sm text-text-muted">We typically reply within a couple of business days.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4 rounded-lg border border-border bg-surface p-6 theme-transition" noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium text-text" htmlFor="name">Name</label>
            <input id="name" {...register("name", { required: true })} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
            {errors.name && <p className="mt-1 text-xs text-danger">Name is required</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text" htmlFor="email">Email</label>
            <input id="email" type="email" {...register("email", { required: true })} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
            {errors.email && <p className="mt-1 text-xs text-danger">A valid email is required</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text" htmlFor="subject">Subject</label>
            <input id="subject" {...register("subject")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text" htmlFor="message">Message</label>
            <textarea id="message" rows={5} {...register("message", { required: true })} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
            {errors.message && <p className="mt-1 text-xs text-danger">Message is required</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Send message"}
          </button>
        </form>
      )}
    </div>
  );
}
