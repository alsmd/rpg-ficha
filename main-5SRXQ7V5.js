provider "aws" {
  region = "us-east-1" # Altere para a região desejada
}

# Função Lambda
resource "aws_lambda_function" "example" {
  filename         = "lambda_function_payload.zip" # Código compactado da Lambda
  function_name    = "daily-scheduler-lambda"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "index.handler" # Handler no código
  runtime          = "nodejs18.x"    # Ajuste conforme a linguagem usada
  source_code_hash = filebase64sha256("lambda_function_payload.zip")
}

# Papel (Role) para a Lambda
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

# Política para a Lambda
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

# Associar a política ao papel da Lambda
resource "aws_iam_role_policy_attachment" "lambda_policy_attach" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_exec_policy.arn
}

# Agendamento do EventBridge Scheduler
resource "aws_scheduler_schedule" "daily_schedule" {
  name          = "daily-schedule"
  schedule_expression = "rate(1 day)" # Frequência do agendamento
  flexible_time_window {
    mode = "OFF"
  }
  target {
    arn     = aws_lambda_function.example.arn
    role_arn = aws_iam_role.lambda_exec.arn # Papel usado para invocar a Lambda
    input    = jsonencode({ message = "Hello from EventBridge Scheduler" }) # Dados de entrada para a Lambda
  }
}

# Permissão para o Scheduler invocar a Lambda
resource "aws_lambda_permission" "allow_scheduler" {
  statement_id  = "AllowScheduler"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.example.function_name
  principal     = "scheduler.amazonaws.com"
  source_arn    = aws_scheduler_schedule.daily_schedule.arn
}
