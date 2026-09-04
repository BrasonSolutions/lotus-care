import type { Meta, StoryObj } from "@storybook/react";
import { ServiceCard } from "@/components/service-card";
import { services, enhanceServices } from "@/data/services";

const meta: Meta<typeof ServiceCard> = {
  title: "UI/ServiceCard",
  component: ServiceCard,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ServiceCard>;

export const IconCard: Story = {
  args: { service: enhanceServices[0] },
};

export const ImageCard: Story = {
  args: { service: services[0] },
};

export const AllIconCards: Story = {
  render: () => (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {enhanceServices.map((service) => (
        <ServiceCard key={service.title} service={service} />
      ))}
    </div>
  ),
};

export const AllImageCards: Story = {
  render: () => (
    <div className="grid sm:grid-cols-2 gap-6 p-6">
      {services.map((service) => (
        <ServiceCard key={service.title} service={service} />
      ))}
    </div>
  ),
};
