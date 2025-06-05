import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base("appWZS2nyZQ9vuQM7");

export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: "Missing code" });

  const records = await base("senderistas")
    .select({
      filterByFormula: `{Codigo} = "${code}"`,
      maxRecords: 1,
    })
    .firstPage();

  if (records.length === 0) {
    return res.status(404).json({ error: "Not found" });
  }

  return res.status(200).json({ recordId: records[0].id });
}
