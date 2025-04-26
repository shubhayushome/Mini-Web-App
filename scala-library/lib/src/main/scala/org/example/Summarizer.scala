package org.example

object Summarizer {
  def summarize(text: String): String = {
    s"Summary: ${text.take(100)}..."
  }
}