package hiromitsu.sentence;

import lombok.Data;

/**
 * 文中の関連.グラフにおけるノード間の枝
 */
@Data
public class Edge {
  private Node from;
  private Node to;
  private EdgeType type;
}
