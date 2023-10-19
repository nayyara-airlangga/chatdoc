import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { env } from "~/env.mjs";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import axios from "axios";
import stream from "stream";
import { promisify } from "util";
import { createWriteStream, mkdir } from "fs";

const pipeline = promisify(stream.pipeline);

mkdir(env.TMP_DIR, { recursive: true }, (err) => {
  if (err !== null) {
    console.error(err);
    process.exit(1);
  }
});

export const documentRouter = createTRPCRouter({
  getS3UploadPresignedUrl: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const uploadCommand = new PutObjectCommand({
        Bucket: env.AWS_S3_BUCKET_NAME,
        Key: "documents/" + ctx.session.user.id + "_" + input.key,
      });

      return await getSignedUrl(ctx.s3, uploadCommand);
    }),

  getS3ObjectPresignedUrl: protectedProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ ctx, input }) => {
      const getCommand = new GetObjectCommand({
        Bucket: env.AWS_S3_BUCKET_NAME,
        Key: "documents/" + ctx.session.user.id + "_" + input.key,
      });

      return await getSignedUrl(ctx.s3, getCommand);
    }),

  loadFromS3ToPinecone: protectedProcedure
    .input(z.object({ fileKey: z.string(), presignedDownloadUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const res = await axios.get(input.presignedDownloadUrl, {
        responseType: "stream",
      });

      const tmpPath =
        env.TMP_DIR + "/" + ctx.session.user.id + "_" + input.fileKey;

      await pipeline(res.data, createWriteStream(tmpPath));
      return;
    }),
});
