const AccountVerifyPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 text-center shadow-sm">
        <h1 className="text-2xl font-semibold">Verify your account</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Your verification step is pending. Please follow the instructions from
          your email.
        </p>
      </div>
    </main>
  );
};

export default AccountVerifyPage;
