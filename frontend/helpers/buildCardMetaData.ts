import { CardForm } from "@/types/card";

export function buildCardMetadata(form: CardForm) {
  return {
    name: form.title.trim(),
    description: form.description.trim(),
    image: form.imageUri.trim(),
    attributes: [
      {
        trait_type: "Sport",
        value: form.sport,
      },
      {
        trait_type: "Series",
        value: form.series.trim(),
      },
      {
        trait_type: "Edition",
        value: form.edition.trim(),
      },
      {
        trait_type: "Rarity",
        value: form.rarity,
      },
      {
        trait_type: "Total Copies",
        value: form.totalCopies,
      },
    ].filter((attribute) => {
      if (typeof attribute.value === "string") {
        return attribute.value.trim().length > 0;
      }

      return attribute.value > 0;
    }),
  };
}
