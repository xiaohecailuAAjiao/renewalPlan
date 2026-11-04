import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

async function main() {
    // const filePath = path.join(_dirname, '../../data/users.json')
    const fileName = process.argv[2] ?? "users.json";
    const filePath = path.join(_dirname, "../../data", fileName);

    try {
        const result = await fs.readFile(filePath, "utf8")
        const users = JSON.parse(result) as Array<{ id: number; name: string; role: string }>;
        console.log(`共 ${users.length} 个用户`);
        for (const u of users) {
            console.log(`- ${u.name} (${u.role})`);
        }
    }catch(error){
       console.error("ERROR:"+ error)
    }
    process.exitCode = 1;
    console.log(123)
}

await main()


