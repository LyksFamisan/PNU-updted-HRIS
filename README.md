
  # Enterprise HRIS and Payroll App

  This is a code bundle for Enterprise HRIS and Payroll App. The original project is available at https://www.figma.com/design/5GPJVJ0me1EzqPsrzErifY/Enterprise-HRIS-and-Payroll-App.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## External Recruitment Platform prototype

  Open `/apply` to use the public PNU external-applicant portal. Public vacancy
  browsing does not require an account. Registration, email verification, password
  reset, applicant records, application drafts, notification preferences, and
  uploaded-document metadata are simulated in this browser; the mock account
  password is hashed but this is **not production authentication**. The first
  mock API store includes a fictional `demo.applicant@example.test` application,
  status history, notification, and assessment schedule. Register with that email
  to see the isolated sample record.

  Application documents are validated as PDF/JPG/PNG using the configurable
  1–50 MB size limit, but this
  prototype stores names and metadata only, not file contents. Never use real or
  sensitive applicant information in this demo. Sample published vacancy
  deadlines are fictional and are seeded for demonstration.

  `src/app/externalRecruitmentApi.ts` defines the isolated data/API boundary,
  mock persistence, HRIPS applicant mapping, and a notification provider
  interface. Replace the mock implementation with server endpoints for
  registration, verified authentication, profile and application CRUD, protected
  uploads, HRIPS vacancy/status/schedule synchronization, and email/SMS delivery.
  The backend must enforce per-applicant authorization, server-side validation,
  file scanning/storage and retention, audit logging, rate limits, secure
  verification/reset tokens, and a retryable synchronization outbox. Configure
  SMS sender names with the provider and keep all provider credentials server-side.
  The current “Retry / reconcile HRIPS” action only reconciles the browser mock
  with this app's in-memory recruitment module; no remote service is configured.
  