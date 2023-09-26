import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { AzureStorageService } from './azure-storage.service';
import { v4 as uuid } from 'uuid';

/**
 * Module for interacting with Azure Storage.
 */
@Module({
  providers: [AzureStorageService],
})
export class AzureStorageModule implements OnModuleInit {
  /**
   * Logger instance for the AzureStorageModule class.
   */
  private readonly logger = new Logger(AzureStorageModule.name);

  /**
   * The instance of the AzureStorageService class used by this module.
   */
  private readonly azureStorageService: AzureStorageService;

  /**
   * The name of the Azure Storage account.
   */
  private readonly accountName: string = 'AZURE STORAGE ACCOUNT NAME HERE';

  /**
   * The name of the Azure Storage container.
   */
  private readonly containerName: string = 'AZURE STORAGE CONTAINER NAME HERE';

  /**
   * The Shared Access Signature (SAS) token for the Azure Storage account.
   */
  private readonly sasToken: string = 'CONTAINER LEVEL SERVICE SAS TOKEN HERE';

  /**
   * Creates an instance of AzureStorageModule.
   */
  constructor() {
    this.azureStorageService = new AzureStorageService(
      this.accountName,
      this.containerName,
      this.sasToken,
    );
  }

  /**
   * Lifecycle hook that is called after the module has been initialized.
   * Uploads a test blob to Azure Storage.
   */
  async onModuleInit(): Promise<void> {
    const id: string = uuid();
    const blobName: string = `${id}/test.txt`;
    this.logger.log(`Uploading blob ${blobName} to Azure Storage...`);
    try {
      await this.azureStorageService.uploadBlob(blobName, 'Hello, world!', {
        metadata: { id },
      });
    } catch (error) {
      this.logger.error(
        `Failed to upload blob ${blobName} to Azure Storage. Error: ${error}`,
      );
      throw error;
    }
  }
}
