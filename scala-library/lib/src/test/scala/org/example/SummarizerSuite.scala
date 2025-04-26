package org.example

import org.scalatest.funsuite.AnyFunSuite

class SummarizerSuite extends AnyFunSuite {
  test("summarize works") {
    val input = "This is a long text that should be summarized."
    val result = Summarizer.summarize(input)
    assert(result.startsWith("Summary:"))
  }
}
