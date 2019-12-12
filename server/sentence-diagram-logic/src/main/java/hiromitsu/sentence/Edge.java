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
  
  public String toPrettyString() {
    StringBuffer sb = new StringBuffer();
    String fromString = from.toPrettyString();
    String toString = to.toPrettyString();
    sb.append(fromString).append("--").append(type.toString()).append("-->").append(toString);
    return sb.toString();
  }
}
