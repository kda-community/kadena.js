import { Injectable } from '@angular/core';
import readMessage from '../common/utils/readMessage';
import writeMessage from '../common/utils/writeMessage';

@Injectable({ providedIn: 'root' })
export class AppService {
  async writeMessage(account: string, message: string) {
    try {
      await writeMessage({ account, messageToWrite: message });
    } catch (e) {
      console.log(e);
    }
  }

  async readMessage(account: string): Promise<string> {
    return await readMessage({ account });
  }
}
