export const プラグインID = "memory-synapse-db";
export const 読み取り専用画面ID = "memory-synapse-db-readonly";
export const 対象ルート初期値 = "Instagram_Logs/Synapses";

export interface プラグイン設定 {
  targetRoot: string;
}

export const プラグイン設定初期値: プラグイン設定 = {
  targetRoot: 対象ルート初期値
};
