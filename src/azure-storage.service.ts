import {
  AnonymousCredential,
  BlockBlobUploadOptions,
  ContainerClient,
} from '@azure/storage-blob';
import { Logger } from '@nestjs/common';

/**
 * Service for interacting with Azure Blob Storage.
 */
export class AzureStorageService {
  /**
   * The name of the Azure Storage account.
   */
  private readonly accountName: string;

  /**
   * The name of the container used for storing data in Azure Storage.
   */
  private readonly containerName: string;

  /**
   * The Shared Access Signature (SAS) token used for authentication with Azure Storage.
   */
  private readonly sasToken: string;

  /**
   * The client used to interact with the Azure Blob Storage container.
   */
  private readonly containerClient: ContainerClient;

  /**
   * Logger instance for AzureStorageService.
   */
  private readonly logger = new Logger(AzureStorageService.name);

  /**
   * Creates an instance of AzureStorageService.
   * @param {string} accountName - The name of the Azure Storage account.
   * @param {string} containerName - The name of the container within the Azure Storage account.
   * @param {string} sasToken - The Shared Access Signature (SAS) token for accessing the container.
   */
  constructor(accountName: string, containerName: string, sasToken: string) {
    this.accountName = accountName;
    this.containerName = containerName;
    this.sasToken = sasToken;
    this.containerClient = new ContainerClient(
      `https://${this.accountName}.blob.core.windows.net/${this.containerName}?${this.sasToken}`,
      new AnonymousCredential(),
    );
  }

  /**
   * Uploads a blob to the container.
   * @param blobName - The name of the blob to upload.
   * @param fileContent - The content of the file to upload.
   * @param options - Optional settings for the upload operation.
   * @returns A Promise that resolves when the upload is complete.
   * @throws An error if the upload fails.
   */
  async uploadBlob(
    blobName: string,
    fileContent: string,
    options?: BlockBlobUploadOptions,
  ): Promise<void> {
    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.upload(fileContent, fileContent.length, options);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
