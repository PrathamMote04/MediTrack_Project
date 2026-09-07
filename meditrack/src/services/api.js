export const fetchDrugLabel = async (query) => {
  try {
    const res = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:${encodeURIComponent(query)}&limit=10`);
    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error(`FDA API Error: ${res.status}`);
    }
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("fetchDrugLabel Error:", error);
    throw error;
  }
};

export const fetchDrugEvents = async (query) => {
  try {
    const cleanQuery = query.replace(/[^a-zA-Z0-9 ]/g, "").split(" ")[0];
    const res = await fetch(`https://api.fda.gov/drug/event.json?search=patient.drug.medicinalproduct:${encodeURIComponent(cleanQuery)}&limit=1`);
    if (!res.ok) return 0;
    const data = await res.json();
    return data.meta?.results?.total || 0;
  } catch (error) {
    return 0;
  }
};

export const fetchHealthStats = async () => {
  try {
    const res = await fetch('https://disease.sh/v3/covid-19/all');
    if (!res.ok) throw new Error("Failed to fetch health stats");
    return await res.json();
  } catch (error) {
    console.error("fetchHealthStats Error:", error);
    throw error;
  }
};

export const fetchQuote = async () => {
  try {
    const res = await fetch('https://api.quotable.io/random?tags=health|science|inspirational');
    if (!res.ok) throw new Error("Failed to fetch quote");
    return await res.json();
  } catch (error) {
    return { content: "The greatest wealth is health.", author: "Virgil" };
  }
};
