import axios from "axios";
import { generate } from "random-words";
import _ from "lodash";

// Define types for word and translation
interface MyObject {
    translatedText: string;
}
interface WordType {
    word: string;
    meaning: string;
    options: string[];
}
type LangType = 'es' | 'fr' | 'ja' | 'hi-in'; // You can expand the language types as needed

// Function to generate MCQ options for translated words
const generateMCQ = (meaning: MyObject[], idx: number): string[] => {
    const correctAns: string = meaning[idx].translatedText;
    console.log("Correct Answer: ", correctAns);

    const allMeaningExceptForCorrect = meaning.filter((i) => i.translatedText !== correctAns);
    const incorrectOptions: string[] = _.sampleSize(allMeaningExceptForCorrect, 3).map((i) => i.translatedText);
    const mcqOptions = _.shuffle([...incorrectOptions, correctAns]);

    console.log("MCQ Options: ", mcqOptions);
    return mcqOptions;
};

// Function to translate words and generate MCQs
export const translateWords = async (params: LangType|String ): Promise<WordType[]> => {
    const words = generate(8); // Generate 8 random words
    console.log("Generated Words: ", words);

    const options = {
        method: "POST",
        url: "https://google-translator9.p.rapidapi.com/v2",
        headers: {
            "x-rapidapi-key": "f86dae485dmsh579efd53b13035ap177bb3jsnf3c6321a2509",
            "x-rapidapi-host": "google-translator9.p.rapidapi.com",
            "Content-Type": "application/json",
        },
        data: {
            q: words,
            source: "en",
            target: params,
            format: "text",
        },
    };

    try {
        const response = await axios.request(options);
        console.log("API Response: ", response.data);

        // Check if the expected data is present
        if (!response.data?.data?.translations) {
            throw new Error("Translations not found in the API response");
        }

        const arr: WordType[] = response.data.data.translations.map((value: any, i: any) => {
            const options: string[] = generateMCQ(response.data.data.translations, i);
            return {
                word: words[i],
                meaning: value.translatedText,
                options,
            };
        });

        console.log("Generated MCQs: ", arr);
        return arr;
    } catch (error) {
        console.error("Error fetching translations:", error);
        return [];
    }
};

// Function to count matching elements in two arrays
export const countMatchingElements = (arr1: string[], arr2: string[]): number => {
    if (arr1.length !== arr2.length) throw new Error("Arrays are not equal");

    let matchedCount = 0;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] === arr2[i]) matchedCount++;
    }
    return matchedCount;
};

// Function to fetch audio of translated text using VoiceRSS API
export const fetchAudio = async (text: string, language: LangType|any): Promise<string> => {
    const key = "399a0802a3d84fbd828b20f796216b46"; // VoiceRSS API Key
    const rapidKey = "f86dae485dmsh579efd53b13035ap177bb3jsnf3c6321a2509";

    const encodedParams = new URLSearchParams({
        src: text,
        r: "-3",
        v: "Salim",
        c: "mp3",
        f: "8khz_8bit_mono",
        b64: "true",
    });

    // Set language-specific options
    if (language === "ja") encodedParams.set("hl", "ja-jp");
    else if (language === "es") encodedParams.set("hl", "es-es");
    else if (language === "fr") encodedParams.set("hl", "fr-fr");
    else encodedParams.set("hl", "hi-in"); // Default to Hindi

    try {
        const { data }: { data: string } = await axios.post(
            "https://voicerss-text-to-speech.p.rapidapi.com/",
            encodedParams,
            {
                params: { key },
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    "X-RapidAPI-Key": rapidKey,
                    "X-RapidAPI-Host": "voicerss-text-to-speech.p.rapidapi.com",
                },
            }
        );

        console.log("Fetched Audio (Base64):", data);
        return data;
    } catch (error) {
        console.error("Error fetching audio:", error);
        return "";
    }
};
