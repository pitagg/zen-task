min_coverage_percent = 100
SimpleCov.minimum_coverage min_coverage_percent
SimpleCov.at_exit do
  # Changes the output color to red if coverage is low
  puts "\033[31m" if SimpleCov.result.covered_percent < min_coverage_percent
  SimpleCov.result.format!
end
