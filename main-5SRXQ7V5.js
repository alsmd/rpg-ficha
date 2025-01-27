provider "aws" {
  region = "us-east-1" # Altere para sua região
}

resource "aws_lambda_function" "example" {
  filename         = "lambda_function_payload.zip" # O arquivo compactado contendo o código da sua Lambda
  function_name    = "daily-scheduler-lambda"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "index.handler" # Nome do arquivo e função handler no código
  runtime          = "nodejs18.x"    # Ajuste conforme sua linguagem (ex: python3.9)
  source_code_hash = filebase64sha256("lambda_function_payload.zip")
}

resource "aws_iam_role" "lambda_exec" {
  name = "lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy" "lambda_exec_policy" {
  name        = "lambda_exec_policy"
  description = "IAM policy for Lambda execution"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attach" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_exec_policy.arn
}

resource "aws_cloudwatch_event_rule" "daily_event" {
  name        = "daily-schedule"
  description = "Trigger Lambda daily"
  schedule_expression = "rate(1 day)" # Alterar para a frequência desejada
}

resource "aws_cloudwatch_event_target" "lambda_target" {
  rule      = aws_cloudwatch_event_rule.daily_event.name
  target_id = "daily-lambda-target"
  arn       = aws_lambda_function.example.arn
}

resource "aws_lambda_permission" "allow_event" {
  statement_id  = "AllowEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.example.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.daily_event.arn
}
