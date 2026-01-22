import { pool, db } from "../server/db";
import { products, productVariants } from "../shared/schema";
import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";

async function seedFromCsv() {
  try {
    const csvPath = path.join(process.cwd(), "attached_assets/wallpaper_sku_import_1769039780097.csv");
    const fileContent = fs.readFileSync(csvPath, "utf-8");
    
    const records: any[] = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    console.log(`Found ${records.length} records in CSV. Seeding...`);

    // Group by cover_product_photo to treat as a base product
    const productGroups = new Map<string, any[]>();
    for (const record of records) {
      const productKey = record.cover_product_photo;
      if (!productGroups.has(productKey)) {
        productGroups.set(productKey, []);
      }
      productGroups.get(productKey)?.push(record);
    }

    console.log(`Processing ${productGroups.size} unique products...`);

    for (const [coverPhoto, variants] of productGroups.entries()) {
      const firstVariant = variants[0];
      const isTest = firstVariant.name.toLowerCase().includes("test");
      const productName = firstVariant.brand + " Series " + firstVariant.product_id + (isTest ? "_test" : "");
      
      console.log(`Inserting product: ${productName}`);
      
      // Insert base product
      const [productResult]: any = await db.insert(products).values({
        name: productName,
        type: "wallpaper",
        description: `Premium wallpaper dari koleksi ${firstVariant.brand}. Menghadirkan kemewahan dan tekstur berkualitas tinggi untuk dinding Anda.`,
        price: "450000",
        stock: variants.reduce((acc: number, v: any) => acc + parseInt(v.stock || "0"), 0) as number,
        imageUrl: coverPhoto.startsWith("http") ? coverPhoto : `https://${coverPhoto}`,
        colorHex: "#FFFFFF",
        roomCategory: "living_room",
        isNewArrival: true,
      });

      const productId = productResult.insertId;

      // Insert variants
      for (const variant of variants) {
        // Fix: Use the correct schema field names from shared/schema.ts
        await db.insert(productVariants).values({
          productId: productId,
          name: variant.name + (isTest ? "_test" : ""),
          price: "450000",
          stock: parseInt(variant.stock || "0"),
          imageUrl: variant.variant_photo.startsWith("http") ? variant.variant_photo : `https://${variant.variant_photo}`,
          colorHex: "#FFFFFF",
        });
      }
    }

    console.log("Seeding from CSV completed successfully.");
  } catch (error) {
    console.error("Error seeding from CSV:", error);
  } finally {
    process.exit(0);
  }
}

seedFromCsv();
