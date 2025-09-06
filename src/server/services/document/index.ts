import debug from 'debug';
import { readFileSync } from 'fs';

import { DocumentModel } from '@/database/models/document';
import { FileModel } from '@/database/models/file';
import { LobeChatDatabase } from '@/database/type';
import { LobeDocument } from '@/types/document';

import { FileService } from '../file';

const log = debug('lobe-chat:service:document');

export class DocumentService {
  userId: string;
  private fileModel: FileModel;
  private documentModel: DocumentModel;
  private fileService: FileService;

  constructor(db: LobeChatDatabase, userId: string) {
    this.userId = userId;
    this.fileModel = new FileModel(db, userId);
    this.fileService = new FileService(db, userId);
    this.documentModel = new DocumentModel(db, userId);
  }

  /**
   * 解析文件内容
   *
   */
  async parseFile(fileId: string): Promise<LobeDocument> {
    const { filePath, file, cleanup } = await this.fileService.downloadFileToLocal(fileId);

    const logPrefix = `[${file.name}]`;
    log(`${logPrefix} 开始解析文件, 路径: ${filePath}`);

    try {
      // Simplified file reading for mental wellness chatbot
      // Focus on text-based wellness content and journals
      let content: string;
      let fileType: string;
      
      if (file.fileType === 'text/plain' || file.fileType === 'text/markdown') {
        content = readFileSync(filePath, 'utf-8');
        fileType = file.fileType;
      } else {
        // For non-text files in mental wellness context, provide helpful guidance
        throw new Error(
          `File type ${file.fileType} is not supported in mental wellness mode. ` +
          'Please upload text files, journals, or wellness documents for AI analysis. ' +
          'Supported formats: .txt, .md (markdown) files for mental health journaling and reflection.'
        );
      }

      log(`${logPrefix} 文件解析成功 %O`, {
        fileType: fileType,
        size: content.length,
      });

      const document = await this.documentModel.create({
        content: content,
        fileId,
        fileType: file.fileType,
        metadata: { 
          title: file.name,
          wellness_content: true,
          processed_for: 'mental_health_analysis'
        },
        pages: [{
          pageContent: content,
          charCount: content.length,
          lineCount: content.split('\n').length,
          metadata: {
            pageNumber: 1,
            sectionTitle: 'Mental Wellness Content'
          }
        }],
        source: file.url,
        sourceType: 'file',
        title: file.name,
        totalCharCount: content.length,
        totalLineCount: content.split('\n').length,
      });

      return document as LobeDocument;
    } catch (error) {
      console.error(`${logPrefix} 文件解析失败:`, error);
      throw error;
    } finally {
      cleanup();
    }
  }
}
