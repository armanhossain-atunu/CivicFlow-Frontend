import { Button } from "@/components/ui/button";

const AboutPage = () => {
  return (
    <main>
      {/* Section 1: Hero */}
      <section className="border-b">
        <div className="container mx-auto px-4 py-20 text-center">
          <span className="text-lg font-medium uppercase tracking-wider text-primary">
            About CivicFlow
          </span>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Making City Services
            <span className="text-primary"> Simple & Connected</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            CivicFlow connects citizens, staff, and technicians through one
            simple platform for reporting, managing, and resolving city service
            requests.
          </p>
        </div>
      </section>

      {/* Section 2: Our Mission */}
      <section>
        <div className="container mx-auto grid gap-12 px-4 py-20 md:grid-cols-2 md:items-center">
          <div>
            <span className="text-sm font-semibold text-primary">
              OUR MISSION
            </span>

            <h2 className="mt-3 text-3xl font-bold">
              Building Better Communities Through Technology
            </h2>

            <p className="mt-5 leading-7 text-muted-foreground">
              Our mission is to make communication between citizens and city
              service teams faster, clearer, and more transparent.
            </p>

            <p className="mt-4 leading-7 text-muted-foreground">
              CivicFlow provides a structured digital workflow where citizens
              can submit complaints, track progress, and receive better service.
            </p>
          </div>

          <div className="rounded-2xl border bg-muted/30 p-10">
            <div className="text-5xl font-bold text-primary">01</div>
            <h3 className="mt-5 text-2xl font-semibold">Citizen First</h3>
            <p className="mt-3 text-muted-foreground">
              Every feature is designed to make civic services easier and more
              accessible.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: How CivicFlow Works */}
      <section className="bg-muted/30">
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold text-primary">
              HOW IT WORKS
            </span>

            <h2 className="mt-3 text-3xl font-bold">
              From Complaint to Resolution
            </h2>

            <p className="mt-4 text-muted-foreground">
              CivicFlow creates a clear workflow for handling city service
              requests.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Submit",
                description:
                  "Citizens submit a complaint or service request with the necessary information.",
              },
              {
                number: "02",
                title: "Assign",
                description:
                  "Authorized staff review the request and assign it to the appropriate technician.",
              },
              {
                number: "03",
                title: "Resolve",
                description:
                  "Technicians work on the issue and update the request until it is resolved.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="rounded-xl border bg-background p-6"
              >
                <span className="text-2xl font-bold text-primary">
                  {item.number}
                </span>

                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Key Features */}
      <section>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <span className="text-sm font-semibold text-primary">
              WHAT WE PROVIDE
            </span>

            <h2 className="mt-3 text-3xl font-bold">
              Everything in One Platform
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Complaint Management",
                description: "Create and manage city complaints digitally.",
              },
              {
                title: "Status Tracking",
                description:
                  "Follow every request from submission to resolution.",
              },
              {
                title: "Smart Assignment",
                description:
                  "Connect service requests with the right technicians.",
              },
              {
                title: "Transparent Service",
                description:
                  "Keep citizens informed throughout the service process.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border p-6 transition hover:shadow-md"
              >
                <h3 className="font-semibold">{feature.title}</h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: CTA */}
      <section className="border-t">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold">
            Together, We Can Build Better Cities
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            CivicFlow brings citizens and city service teams together to create
            a faster, more transparent, and more connected civic experience.
          </p>

          <div className="mt-8">
            <Button className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90">
              Get Started
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
