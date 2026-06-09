export type ProgramInput = {
  name: string;
  description: string;
};

export function parseProgramInput(
  formData: FormData,
): { data: ProgramInput | null; error?: string } {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!name) {
    return { data: null, error: "Please enter a program name." };
  }

  if (!description) {
    return { data: null, error: "Please enter a program description." };
  }

  return {
    data: {
      name,
      description,
    },
  };
}
