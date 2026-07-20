import { useState } from "react";

import { CardForm } from "@/types/card";

export const INITIAL_CARD_FORM: CardForm = {
  title: "",
  description: "",
  sport: "Football",
  series: "",
  edition: "",
  rarity: "Common",
  totalCopies: 1,
  imageUri: "",
};

export function useCardForm() {
  const [cardForm, setCardForm] = useState<CardForm>(INITIAL_CARD_FORM);

  const updateCardForm = <K extends keyof CardForm>(
    field: K,
    value: CardForm[K],
  ) => {
    setCardForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetCardForm = () => {
    setCardForm(INITIAL_CARD_FORM);
  };

  return {
    cardForm,
    updateCardForm,
    resetCardForm,
  };
}
