export interface ExtractedLineup {
  festivalName?: string;
  date?: string;
  stages: Array<{
    name: string;
    artists: Array<{
      name: string;
      startTime?: string;
      endTime?: string;
    }>;
  }>;
}

export async function extractLineupFromImage(
  imageFile: File
): Promise<ExtractedLineup | null> {
  try {
    const base64Image = await fileToBase64(imageFile);

    const prompt = `Extract the festival lineup information from this image. Return ONLY valid JSON with this exact structure (no markdown, no extra text):
{
  "festivalName": "name of festival if visible",
  "date": "YYYY-MM-DD format if visible",
  "stages": [
    {
      "name": "stage name",
      "artists": [
        {
          "name": "artist name",
          "startTime": "HH:MM in 24hr format if visible",
          "endTime": "HH:MM in 24hr format if visible"
        }
      ]
    }
  ]
}

If you can't determine something, use reasonable defaults like "Main Stage" for stage name. Extract ALL artist names you can see.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY || ""}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: base64Image,
                },
              },
            ],
          },
        ],
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error:", await response.text());
      return null;
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return null;
    }

    let jsonContent = content.trim();
    if (jsonContent.startsWith("```")) {
      jsonContent = jsonContent
        .replace(/```json?\n?/g, "")
        .replace(/```\n?$/, "");
    }

    const extracted = JSON.parse(jsonContent);
    return extracted;
  } catch (error) {
    console.error("Error extracting lineup from image:", error);
    return null;
  }
}

export async function extractLineupFromURL(
  url: string
): Promise<ExtractedLineup | null> {
  try {
    const response = await fetch("/api/extract-lineup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.lineup;
  } catch (error) {
    console.error("Error extracting lineup from URL:", error);
    return null;
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
