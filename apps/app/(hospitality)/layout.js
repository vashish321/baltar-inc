export default function HospitalityLayout({ children }) {
  return (
    <div className="w-full overflow-x-hidden min-h-screen flex flex-col">
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}
