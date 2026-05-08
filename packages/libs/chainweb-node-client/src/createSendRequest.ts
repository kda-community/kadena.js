import type { ICommand } from '@kda-community/types';
import type { ISendRequestBody } from './interfaces/PactAPI';

/**
 * Makes outer wrapper for a 'send' endpoint.
 * @alpha
 * @param commands - one or an array of commands, see mkSingleCmd
 */
export function createSendRequest(
  commands: ICommand | ICommand[],
): ISendRequestBody {
  return {
    cmds: Array.isArray(commands) ? commands : [commands],
  };
}
