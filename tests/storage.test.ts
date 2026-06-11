import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Storage } from "../src/storage/storage";

describe("Storage S3 Client", () => {
  beforeEach(() => {
    // Mock global fetch
    globalThis.fetch = vi.fn().mockImplementation((url: string, options: any) => {
      if (url.endsWith("/my-bucket/file.txt")) {
        if (options.method === "GET") {
          return Promise.resolve({
            ok: true,
            text: () => Promise.resolve("hello world"),
            json: () => Promise.resolve({ text: "hello world" }),
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(11)),
          } as Response);
        }
        if (options.method === "PUT") {
          return Promise.resolve({ ok: true } as Response);
        }
        if (options.method === "DELETE") {
          return Promise.resolve({ ok: true } as Response);
        }
      }

      if (url.endsWith("/")) {
        // ListBuckets XML response
        const bucketsXml = `<?xml version="1.0" encoding="UTF-8"?>
          <ListAllMyBucketsResult>
            <Buckets>
              <Bucket>
                <Name>my-bucket</Name>
                <CreationDate>2026-06-11T00:00:00.000Z</CreationDate>
              </Bucket>
            </Buckets>
          </ListAllMyBucketsResult>`;
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(bucketsXml),
        } as Response);
      }

      if (url.endsWith("/my-bucket")) {
        // ListObjects XML response
        const objectsXml = `<?xml version="1.0" encoding="UTF-8"?>
          <ListBucketResult>
            <Name>my-bucket</Name>
            <Prefix></Prefix>
            <MaxKeys>1000</MaxKeys>
            <IsTruncated>false</IsTruncated>
            <Contents>
              <Key>file.txt</Key>
              <LastModified>2026-06-11T00:00:00.000Z</LastModified>
              <ETag>"abc"</ETag>
              <Size>11</Size>
            </Contents>
          </ListBucketResult>`;
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(objectsXml),
        } as Response);
      }

      return Promise.reject(new Error("Unknown URL: " + url));
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should create storage instance with options", () => {
    const s3 = new Storage({
      bucket: "my-bucket",
      endpoint: "http://custom-s3-host.com",
    });
    expect(s3).toBeInstanceOf(Storage);
  });

  it("should list buckets", async () => {
    const s3 = new Storage({ bucket: "my-bucket", endpoint: "http://custom-s3-host.com" });
    const buckets = await s3.listBuckets();
    expect(buckets).toHaveLength(1);
    expect(buckets[0].name).toBe("my-bucket");
  });

  it("should list objects", async () => {
    const s3 = new Storage({ bucket: "my-bucket", endpoint: "http://custom-s3-host.com" });
    const result = await s3.listObjects();
    expect(result.name).toBe("my-bucket");
    expect(result.contents).toHaveLength(1);
    expect(result.contents[0].key).toBe("file.txt");
    expect(result.contents[0].size).toBe(11);
  });

  it("should get object and read as text, json, arrayBuffer", async () => {
    const s3 = new Storage({ bucket: "my-bucket", endpoint: "http://custom-s3-host.com" });
    
    const text = await s3.getObjectAsText("file.txt");
    expect(text).toBe("hello world");

    const json = await s3.getObjectAsJson("file.txt");
    expect(json).toEqual({ text: "hello world" });

    const buffer = await s3.getObjectAsArrayBuffer("file.txt");
    expect(buffer.byteLength).toBe(11);
  });

  it("should put object", async () => {
    const s3 = new Storage({ bucket: "my-bucket", endpoint: "http://custom-s3-host.com" });
    await s3.putObject("file.txt", "hello world", { contentType: "text/plain" });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://custom-s3-host.com/my-bucket/file.txt",
      expect.objectContaining({
        method: "PUT",
        body: expect.any(Uint8Array),
      })
    );
  });

  it("should delete object", async () => {
    const s3 = new Storage({ bucket: "my-bucket", endpoint: "http://custom-s3-host.com" });
    await s3.deleteObject("file.txt");

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://custom-s3-host.com/my-bucket/file.txt",
      expect.objectContaining({
        method: "DELETE",
      })
    );
  });
});
